(ns metabase.sandbox.permissions
  "OSS sandbox permissions utilities for integrating sandbox policies with the permission system."
  (:require
   [metabase.api.common :as api]
   [metabase.permissions.models.data-permissions :as data-perms]
   [metabase.permissions.models.permissions :as perms]
   [metabase.permissions.models.permissions-group :as perms-group]
   [metabase.sandbox.models.group-sandbox :as group-sandbox]
   [metabase.util.log :as log]
   [toucan2.core :as t2]))

(defn- group-has-sandbox-policy?
  "Check if a permissions group has any sandbox policy for the given table."
  [group-id table-id]
  (t2/exists? :model/GroupSandbox
              :group_id group-id
              :table_id table-id))

(defn user-has-sandbox-policy?
  "Check if the current user has any sandbox policy that applies to the given table."
  [table-id]
  (when-let [user-id api/*current-user-id*]
    (let [group-ids (map :id (perms-group/user->groups user-id))]
      (some #(group-has-sandbox-policy? % table-id) group-ids))))

(defn sandboxed-perms-for-table
  "Generate the permission path for sandbox access to a table.
   This grants limited access that gets filtered by sandbox policies."
  [table-id]
  (str "/db/" (t2/select-one-fn :db_id :model/Table :id table-id)
       "/sandbox/table/" table-id "/"))

(defn grant-sandbox-permissions!
  "Grant sandbox permissions to a group for a specific table.
   This allows the group to query the table but only with sandbox filtering applied."
  [group-id table-id]
  (let [table (t2/select-one :model/Table :id table-id)
        sandbox-path (sandboxed-perms-for-table table-id)]
    (log/infof "Granting sandbox permissions to group %s for table %s" group-id table-id)
    ;; Grant sandbox-specific permission
    (perms/grant-permissions! group-id sandbox-path)
    ;; Also ensure they have read access to the database
    (perms/grant-permissions! group-id (str "/db/" (:db_id table) "/"))))

(defn revoke-sandbox-permissions!
  "Revoke sandbox permissions from a group for a specific table."
  [group-id table-id]
  (let [sandbox-path (sandboxed-perms-for-table table-id)]
    (log/infof "Revoking sandbox permissions from group %s for table %s" group-id table-id)
    ;; Direct deletion of sandbox permissions
    (t2/delete! :model/Permissions
                :group_id group-id
                :object sandbox-path)))

(defn sync-sandbox-permissions!
  "Synchronize permissions with current sandbox policies.
   This should be called when sandbox policies are created, updated, or deleted."
  []
  (log/info "Synchronizing sandbox permissions...")
  (let [all-sandboxes (t2/select :model/GroupSandbox)]
    (doseq [{:keys [group_id table_id]} all-sandboxes]
      (grant-sandbox-permissions! group_id table_id))))

(defn check-sandbox-permissions
  "Check if the current user has sandbox access to the given table.
   Returns true if user has sandbox access, false if no access, nil if unrestricted access."
  [table-id]
  (when-let [user-id api/*current-user-id*]
    (let [table (t2/select-one :model/Table :id table-id)
          database-id (:db_id table)]
      (cond
        ;; Superusers bypass all sandbox restrictions
        (:is_superuser (t2/select-one :model/User :id user-id))
        nil
        
        ;; Check if user has sandbox policies for this table
        (user-has-sandbox-policy? table-id)
        true
        
        ;; Check if user has unrestricted permissions to this table
        (data-perms/user-has-permission-for-table? user-id :perms/view-data :unrestricted database-id table-id)
        nil
        
        ;; No access
        :else
        false))))