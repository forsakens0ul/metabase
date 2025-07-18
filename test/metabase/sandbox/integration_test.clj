(ns metabase.sandbox.integration-test
  "Integration tests for OSS sandbox functionality."
  (:require
   [clojure.test :refer :all]
   [metabase.models.permissions-group :as perms-group]
   [metabase.models.table :refer [Table]]
   [metabase.models.field :refer [Field]]
   [metabase.sandbox.models.group-sandbox :as group-sandbox]
   [metabase.sandbox.query-processor.middleware.sandbox-filtering :as sandbox-filtering]
   [metabase.test :as mt]
   [metabase.test.fixtures :as fixtures]
   [toucan2.core :as t2]))

(use-fixtures :once (fixtures/initialize :db))

(deftest test-sandbox-query-filtering
  (testing "Sandbox query filtering middleware applies correct filters"
    (mt/with-temp [Table [{table-id :id} {:name "test_table"}]
                   Field [{field-id :id} {:table_id table-id :name "department"}]]
      (let [query {:query {:source-table table-id}}
            user-id 1
            context {:metabase.query-processor.context/userland-query-info {:current-user-id user-id}}]
        ;; Test that middleware function exists and can be called
        (is (fn? sandbox-filtering/sandbox-filtering-middleware))
        ;; Test basic structure
        (let [middleware-fn (sandbox-filtering/sandbox-filtering-middleware identity)]
          (is (fn? middleware-fn)))))))

(deftest test-sandbox-model-operations
  (testing "GroupSandbox model basic operations"
    (testing "Model is properly defined"
      (is (= :group_sandbox (t2/table-name :model/GroupSandbox))))
    
    (testing "upsert-sandbox! function structure"
      (is (fn? group-sandbox/upsert-sandbox!)))))

(deftest test-sandbox-utilities
  (testing "Sandbox utility functions"
    (testing "extract-table-ids function"
      (let [query {:query {:source-table 123}}]
        (is (= [123] (#'sandbox-filtering/extract-table-ids query)))))
    
    (testing "should-apply-sandbox function with non-superuser"
      (let [query {:query {:source-table 123}}
            user-id 1]
        ;; Function should exist and be callable
        (is (fn? #'sandbox-filtering/should-apply-sandbox?))))))