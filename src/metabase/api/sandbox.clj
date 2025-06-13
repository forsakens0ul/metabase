(ns metabase.api.sandbox
  (:require
   [compojure.core :refer [GET POST PUT DELETE]]
   [metabase.api.common :as api]
   [metabase.models.sandbox-policy :as sandbox-policy]
   [metabase.util :as u]
   [metabase.util.i18n :refer [tru]]))

(api/defendpoint GET "/"
  "获取所有沙盒策略"
  []
  (api/check-superuser)
  (t2/select :model/SandboxPolicy))

(api/defendpoint GET "/:id"
  "获取指定ID的沙盒策略"
  [id]
  (api/check-superuser)
  (api/check-404 (t2/select-one :model/SandboxPolicy :id id)))

(api/defendpoint POST "/"
  "创建新的沙盒策略"
  [:as {{:keys [group_id table_id filter_condition]} :body}]
  (api/check-superuser)
  (api/check-400 group_id "group_id is required")
  (api/check-400 table_id "table_id is required")
  (api/check-400 filter_condition "filter_condition is required")
  (sandbox-policy/create-policy! {:group_id group_id
                                 :table_id table_id
                                 :filter_condition filter_condition}))

(api/defendpoint PUT "/:id"
  "更新现有的沙盒策略"
  [id :as {{:keys [filter_condition]} :body}]
  (api/check-superuser)
  (api/check-404 (t2/select-one :model/SandboxPolicy :id id))
  (api/check-400 filter_condition "filter_condition is required")
  (sandbox-policy/update-policy! id {:filter_condition filter_condition}))

(api/defendpoint DELETE "/:id"
  "删除沙盒策略"
  [id]
  (api/check-superuser)
  (api/check-404 (t2/select-one :model/SandboxPolicy :id id))
  (sandbox-policy/delete-policy! id)
  {:success true})

(api/define-routes) 