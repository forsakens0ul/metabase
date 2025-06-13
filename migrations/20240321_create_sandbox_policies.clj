(ns metabase.db.migrations
  (:require [metabase.db.migrations.helpers :as h]))

(defn up
  "Migrate the database up to version 20240321."
  []
  (h/create-table :sandbox_policies
    [[:id :serial {:primary-key true}]
     [:group_id :integer {:not-null true}]
     [:table_id :integer {:not-null true}]
     [:filter_condition :text {:not-null true}]
     [:created_at :timestamp {:not-null true, :default (h/now)}]
     [:updated_at :timestamp {:not-null true, :default (h/now)}]]
    (h/add-fk :sandbox_policies :group_id :permissions_group :id)
    (h/add-fk :sandbox_policies :table_id :metabase_table :id)
    (h/add-index :sandbox_policies [:group_id :table_id] {:unique true})))

(defn down
  "Migrate the database down from version 20240321."
  []
  (h/drop-table :sandbox_policies)) 