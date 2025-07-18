(ns metabase.sandbox.models.group-sandbox
  "Model definition for OSS Sandboxed row-level permissions (Group × Table)."
  (:require
   [metabase.models.interface :as mi]
   [methodical.core :as methodical]
   [toucan2.core :as t2]))

;; -------------------------
;; Toucan model definition
;; -------------------------

;; We store sandbox policies in the `group_sandbox` relational table created via Liquibase migration.
;; Each record binds a permissions group to a table field and a user attribute key.

;; Define the table name for the model
(methodical/defmethod t2/table-name :model/GroupSandbox [_model] 
  :group_sandbox)

;; Set up model inheritance and policies
(doto :model/GroupSandbox
  (derive :metabase/model)
  (derive ::mi/read-policy.superuser)
  (derive ::mi/write-policy.superuser))

;; ------------------------------------------------------------
;; Helper function: upsert (insert or update) a sandbox record.
;; ------------------------------------------------------------

(defn upsert-sandbox!
  "Insert or update a sandbox record uniquely identified by `(group_id, table_id)`."
  [{:keys [group_id table_id] :as sandbox}]
  (if-let [row (t2/select-one :model/GroupSandbox
                              :group_id group_id
                              :table_id table_id)]
    ;; Update existing record
    (t2/update! :model/GroupSandbox (:id row) sandbox)
    ;; Create new record and return inserted instance
    (first (t2/insert-returning-instances! :model/GroupSandbox sandbox)))) 