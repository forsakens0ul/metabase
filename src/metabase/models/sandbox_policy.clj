(ns metabase.models.sandbox-policy
  (:require
   [metabase.models.interface :as i]
   [metabase.util :as u]
   [toucan2.core :as t2]
   [toucan2.model :as model]))

(model/defmodel SandboxPolicy :sandbox_policies)

(defn- pre-insert [policy]
  (u/prog1 policy
    (assert (integer? (:group_id policy)) "group_id is required")
    (assert (integer? (:table_id policy)) "table_id is required")
    (assert (string? (:filter_condition policy)) "filter_condition is required")))

(defn- pre-update [policy]
  (u/prog1 policy
    (when (contains? policy :filter_condition)
      (assert (string? (:filter_condition policy)) "filter_condition must be a string"))))

(defn create-policy!
  "创建新的沙盒策略"
  [policy]
  (first (t2/insert-returning-instances! :model/SandboxPolicy policy)))

(defn update-policy!
  "更新现有的沙盒策略"
  [id policy]
  (t2/update! :model/SandboxPolicy id policy))

(defn delete-policy!
  "删除沙盒策略"
  [id]
  (t2/delete! :model/SandboxPolicy :id id))

(defn get-policy-for-user-and-table
  "获取用户和表对应的沙盒策略"
  [user-id table-id]
  (let [user-groups (t2/select-fn-set :group_id :permissions_group_membership :user_id user-id)]
    (first (t2/select :model/SandboxPolicy
                      :group_id [:in user-groups]
                      :table_id table-id))))

(defn parse-filter-condition
  "解析过滤条件，替换变量"
  [policy]
  (let [user-id (u/the-id (t2/select-one-fn :user_id :permissions_group_membership
                                           :group_id (:group_id policy)))]
    (clojure.string/replace (:filter_condition policy)
                           #"\{\{current_user_id\}\}"
                           (str user-id)))) 