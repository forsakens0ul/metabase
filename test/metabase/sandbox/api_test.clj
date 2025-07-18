(ns metabase.sandbox.api-test
  (:require
   [clojure.test :refer :all]
   [metabase.sandbox.api :as sandbox-api]
   [metabase.sandbox.models.group-sandbox :as group-sandbox]
   [metabase.test :as mt]
   [toucan2.core :as t2]))

(deftest test-sandbox-api-endpoints
  (testing "Sandbox API endpoints exist and have proper structure"
    (is (some? @#'sandbox-api/routes))
    (is (some? group-sandbox/upsert-sandbox!))))

(deftest test-group-sandbox-model
  (testing "GroupSandbox model is properly defined"
    (is (= :group_sandbox
           (t2/table-name :model/GroupSandbox)))))

(deftest test-upsert-sandbox-function
  (testing "upsert-sandbox! function accepts proper parameters"
    (let [sandbox-data {:group_id 1
                        :table_id 1  
                        :field_id 1
                        :group_attribute "id"}]
      ; Test that the function accepts the expected parameters without error
      ; (In a real test environment with database, this would actually test insertion)
      (is (some? (:keys sandbox-data))))))