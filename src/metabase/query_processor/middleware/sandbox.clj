(ns metabase.query-processor.middleware.sandbox
  (:require
   [metabase.models.sandbox-policy :as sandbox-policy]
   [metabase.query-processor.store :as qp.store]
   [metabase.util :as u]
   [metabase.util.i18n :refer [tru]]))

(defn- get-user-groups
  "获取当前用户所属的所有用户组ID"
  []
  (let [user-id (u/the-id (qp.store/current-user))]
    (t2/select-fn-set :group_id :permissions_group_membership :user_id user-id)))

(defn- apply-sandbox-filter
  "为查询添加沙盒过滤条件"
  [query table-id]
  (let [user-groups (get-user-groups)
        policies (for [group-id user-groups
                      :let [policy (sandbox-policy/get-policy-for-group-and-table group-id table-id)]
                      :when policy]
                  policy)]
    (if (seq policies)
      (let [filter-conditions (map :filter_condition policies)
            combined-filter (str "(" (clojure.string/join " OR " filter-conditions) ")")]
        (update-in query [:query :filter] (fn [existing-filter]
                                           (if existing-filter
                                             [:and existing-filter combined-filter]
                                             combined-filter))))
      query)))

(defn sandbox-middleware
  "查询处理中间件：根据沙盒策略自动添加过滤条件"
  [qp]
  (fn [query]
    (let [table-id (get-in query [:query :source-table])]
      (if (integer? table-id)
        (qp (apply-sandbox-filter query table-id))
        (qp query))))) 