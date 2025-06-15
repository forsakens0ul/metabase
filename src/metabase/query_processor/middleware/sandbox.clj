(ns metabase.query-processor.middleware.sandbox
  (:require
   [metabase.models.sandbox-policy :as sandbox-policy]
   [metabase.query-processor.store :as qp.store]
   [metabase.util :as u]
   [metabase.util.i18n :refer [tru]]))

(defn- apply-sandbox-policy
  "应用沙盒策略到查询中。如果用户属于某个用户组，并且该用户组有对应的沙盒策略，
   则将策略中的过滤条件添加到查询中。"
  [query]
  (let [user-id (get-in query [:user :id])
        table-id (get-in query [:query :source-table])]
    (if (and user-id table-id)
      (if-let [policy (sandbox-policy/get-policy-for-user-and-table user-id table-id)]
        (let [filter-condition (sandbox-policy/parse-filter-condition policy)]
          (-> query
              (update-in [:query :filter] (fn [existing-filter]
                                          (if existing-filter
                                            [:and existing-filter filter-condition]
                                            filter-condition)))))
        query)
      query)))

(defn sandbox-middleware
  "中间件：应用沙盒策略到查询中"
  [qp]
  (fn [query]
    (qp (apply-sandbox-policy query)))) 