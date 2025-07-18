(ns metabase.sandbox.query-processor.middleware.sandbox-filtering
  "OSS query processor middleware for applying sandbox filtering based on GroupSandbox policies."
  (:require
   [metabase.permissions.models.permissions-group :as perms-group]
   [metabase.query-processor.middleware.permissions :as qp.perms]
   [metabase.sandbox.models.group-sandbox :as group-sandbox]
   [metabase.util :as u]
   [metabase.util.log :as log]
   [toucan2.core :as t2]))

(defn- user-group-sandboxes
  "Get all sandbox policies that apply to the current user for the given table-id."
  [user-id table-id]
  (when user-id
    (let [group-ids (map :id (perms-group/user->groups user-id))]
      (when (seq group-ids)
        (t2/select :model/GroupSandbox
                   :group_id [:in group-ids]
                   :table_id table-id)))))

(defn- apply-sandbox-filter
  "Apply sandbox filtering to a query by adding WHERE clauses based on GroupSandbox policies."
  [query user-id table-id]
  (let [sandboxes (user-group-sandboxes user-id table-id)]
    (if (empty? sandboxes)
      query
      (let [sandbox-filters (for [sandbox sandboxes]
                              (let [field-id (:field_id sandbox)
                                    group-attr (:group_attribute sandbox)
                                    user-groups (perms-group/user->groups user-id)
                                    ;; Get the user's group attribute value
                                    attr-value (case group-attr
                                                 "id" (:id (first user-groups))
                                                 "name" (:name (first user-groups))
                                                 nil)]
                                (when (and field-id attr-value)
                                  [:= [:field field-id nil] attr-value])))]
        ;; Add all sandbox filters as AND conditions
        (let [valid-filters (filter some? sandbox-filters)]
          (if (seq valid-filters)
            (update-in query [:query :filter] 
                       (fn [existing-filter]
                         (if existing-filter
                           [:and existing-filter (if (= 1 (count valid-filters))
                                                    (first valid-filters)
                                                    (into [:and] valid-filters))]
                           (if (= 1 (count valid-filters))
                             (first valid-filters)
                             (into [:and] valid-filters)))))
            query))))))

(defn- extract-table-ids
  "Extract all table IDs referenced in a query."
  [query]
  (let [source-table (get-in query [:query :source-table])
        joins (get-in query [:query :joins])
        join-tables (map #(get-in % [:source-table]) joins)]
    (filter some? (conj join-tables source-table))))

(defn- should-apply-sandbox?
  "Check if sandbox filtering should be applied for this user and query."
  [user-id query]
  (and user-id
       (not (:is_superuser (t2/select-one :model/User :id user-id)))
       (get-in query [:query :source-table])))

(defn sandbox-filtering-middleware
  "Query processor middleware that applies sandbox filtering for non-superuser users."
  [qp]
  (fn [query rff context]
    (let [user-id (get-in context [:metabase.query-processor.context/userland-query-info :current-user-id])
          modified-query (if (should-apply-sandbox? user-id query)
                           (let [table-ids (extract-table-ids query)]
                             (reduce (fn [q table-id]
                                       (apply-sandbox-filter q user-id table-id))
                                     query
                                     table-ids))
                           query)]
      (when (not= query modified-query)
        (log/debugf "Applied sandbox filtering for user %s on tables %s" 
                    user-id (extract-table-ids query)))
      (qp modified-query rff context))))