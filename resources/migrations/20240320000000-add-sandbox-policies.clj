(ns metabase.db.migrations
  (:require [metabase.db.migrations.helpers :as h]))

(defn up
  "创建沙盒策略表"
  []
  (h/create-table :sandbox_policy
    [[:id :serial]
     [:name :text]
     [:description :text]
     [:table_id :integer]
     [:group_id :integer]
     [:attribute_remappings :jsonb]
     [:created_at :timestamp]
     [:updated_at :timestamp]]
    (h/add-fk :sandbox_policy :table_id :metabase_table :id)
    (h/add-fk :sandbox_policy :group_id :permissions_group :id)))

(defn down
  "删除沙盒策略表"
  []
  (h/drop-table :sandbox_policy)) 