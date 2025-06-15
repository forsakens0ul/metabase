(ns metabase.api.routes
  (:require
   [metabase.api.routes.sandbox :as sandbox]))

(def routes
  [["/sandbox" sandbox/routes]]) 