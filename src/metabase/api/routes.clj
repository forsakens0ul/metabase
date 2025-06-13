(def ^:private routes
  [;; 添加沙盒API路由
   (api/define-routes metabase.api.sandbox)
   // ... existing code ...
]) 