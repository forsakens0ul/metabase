(ns metabase.models.sandbox-policy
  (:require
   [metabase.models.interface :as mi]
   [metabase.util :as u]
   [toucan2.core :as t2]))

(t2/define-before-insert :model/SandboxPolicy
  [{:keys [filter_condition] :as policy}]
  (u/prog1 policy
    ;; 验证过滤条件的格式
    (when-not (string? filter_condition)
      (throw (ex-info "Filter condition must be a string"
                     {:type :invalid-filter-condition
                      :filter-condition filter_condition})))))

(defn get-policy-for-group-and-table
  "获取指定用户组和表的沙盒策略"
  [group-id table-id]
  (t2/select-one :model/SandboxPolicy
                 :group_id group-id
                 :table_id table-id))

(defn get-policies-for-group
  "获取指定用户组的所有沙盒策略"
  [group-id]
  (t2/select :model/SandboxPolicy
             :group_id group-id))

(defn get-policies-for-table
  "获取指定表的所有沙盒策略"
  [table-id]
  (t2/select :model/SandboxPolicy
             :table_id table-id))

(defn create-policy!
  "创建新的沙盒策略"
  [{:keys [group_id table_id filter_condition]}]
  (first (t2/insert-returning-instances! :model/SandboxPolicy
                                        {:group_id group_id
                                         :table_id table_id
                                         :filter_condition filter_condition})))

(defn update-policy!
  "更新现有的沙盒策略"
  [id {:keys [filter_condition]}]
  (t2/update! :model/SandboxPolicy
              id
              {:filter_condition filter_condition}))

(defn delete-policy!
  "删除沙盒策略"
  [id]
  (t2/delete! :model/SandboxPolicy :id id)) 