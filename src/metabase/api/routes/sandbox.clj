(ns metabase.api.routes.sandbox
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
  (sandbox-policy/get-all-policies))

(api/defendpoint GET "/:id"
  "获取指定ID的沙盒策略"
  [id]
  (api/check-superuser)
  (api/check-404 (sandbox-policy/get-policy (u/get-id id))))

(api/defendpoint POST "/"
  "创建新的沙盒策略"
  [:as {{:keys [name description table_id group_id attribute_remappings]} :body}]
  (api/check-superuser)
  (sandbox-policy/create-policy! name description table_id group_id attribute_remappings))

(api/defendpoint PUT "/:id"
  "更新沙盒策略"
  [id :as {{:keys [name description table_id group_id attribute_remappings]} :body}]
  (api/check-superuser)
  (api/check-404 (sandbox-policy/update-policy! (u/get-id id) name description table_id group_id attribute_remappings)))

(api/defendpoint DELETE "/:id"
  "删除沙盒策略"
  [id]
  (api/check-superuser)
  (api/check-404 (sandbox-policy/delete-policy! (u/get-id id))))

(api/define-routes) 