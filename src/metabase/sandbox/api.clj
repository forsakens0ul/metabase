(ns metabase.sandbox.api
  "OSS sandbox API endpoints for managing row-level security policies."
  (:require
   [metabase.api.common :as api]
   [metabase.api.macros :as api.macros]
   [metabase.sandbox.models.group-sandbox :as group-sandbox]
   [metabase.sandbox.permissions :as sandbox.perms]
   [metabase.util.malli.schema :as ms]
   [toucan2.core :as t2]))

(api.macros/defendpoint :get "/group/:group-id/table/:table-id"
  "Get sandbox configuration for a specific group and table."
  [{:keys [group-id table-id]} :- [:map
                                   [:group-id ms/PositiveInt]
                                   [:table-id ms/PositiveInt]]]
  (api/check-superuser)
  (t2/select-one :model/GroupSandbox
                 :group_id group-id
                 :table_id table-id))

(api.macros/defendpoint :post "/group/:group-id/table/:table-id"
  "Create or update sandbox configuration for a specific group and table."
  [{:keys [group-id table-id]} :- [:map
                                   [:group-id ms/PositiveInt]
                                   [:table-id ms/PositiveInt]]
   _query-params
   {:keys [field_id group_attribute]} :- [:map
                                          [:field_id ms/PositiveInt]
                                          [:group_attribute ms/NonBlankString]]]
  (api/check-superuser)
  (api/check-404 (t2/exists? :model/PermissionsGroup :id group-id))
  (api/check-404 (t2/exists? :model/Table :id table-id))
  (api/check-404 (t2/exists? :model/Field :id field_id))
  (let [result (group-sandbox/upsert-sandbox! {:group_id group-id
                                               :table_id table-id
                                               :field_id field_id
                                               :group_attribute group_attribute})]
    ;; Grant sandbox permissions when creating/updating sandbox policy
    (sandbox.perms/grant-sandbox-permissions! group-id table-id)
    result))

(api.macros/defendpoint :delete "/group/:group-id/table/:table-id"
  "Delete sandbox configuration for a specific group and table."
  [{:keys [group-id table-id]} :- [:map
                                   [:group-id ms/PositiveInt]
                                   [:table-id ms/PositiveInt]]]
  (api/check-superuser)
  (t2/delete! :model/GroupSandbox
              :group_id group-id
              :table_id table-id)
  ;; Revoke sandbox permissions when deleting sandbox policy
  (sandbox.perms/revoke-sandbox-permissions! group-id table-id)
  api/generic-204-no-content)

(api.macros/defendpoint :get "/group/:group-id"
  "Get all sandbox configurations for a specific group."
  [{:keys [group-id]} :- [:map
                          [:group-id ms/PositiveInt]]]
  (api/check-superuser)
  (t2/select :model/GroupSandbox
             :group_id group-id))