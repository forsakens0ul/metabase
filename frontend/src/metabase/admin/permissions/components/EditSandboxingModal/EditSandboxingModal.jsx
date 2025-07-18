import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { t } from "ttag";

import Button from "metabase/core/components/Button";
import Modal from "metabase/components/Modal";
import ModalContent from "metabase/components/ModalContent";
import Select from "metabase/core/components/Select";
import { Box, Text, Stack } from "metabase/ui";

const EditSandboxingModal = ({ 
  table,
  onClose, 
  onSave,
  initialMapping = null
}) => {
  const [fieldId, setFieldId] = useState(initialMapping?.fieldId || null);
  const [groupAttribute, setGroupAttribute] = useState(initialMapping?.groupAttribute || "id");

  // 使用 useMemo 以避免每次渲染都新建数组，满足 eslint 依赖检查
  const fields = useMemo(() => table?.fields || [], [table?.fields]);
  
  // 支持的 Group 属性列表
  const groupAttributes = [
    { value: "id", name: "ID" },
    { value: "name", name: t`Name` }
  ];

  // 如果字段列表不为空且没有选择字段，默认选第一个
  useEffect(() => {
    if (fields.length > 0 && !fieldId) {
      setFieldId(fields[0].id);
    }
  }, [fields, fieldId]);

  const handleSave = () => {
    if (!fieldId) return;
    
    onSave({
      fieldId,
      fieldName: fields.find(f => f.id === fieldId)?.name || "",
      groupAttribute
    });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <ModalContent
        title={t`Configure sandbox access`}
        onClose={onClose}
      >
        <Box p="md">
          <Stack spacing="lg">
            <div>
              <Text weight="bold" mb={2}>{t`Which field in this table should be used to filter data?`}</Text>
              <Select
                value={fieldId}
                onChange={(e) => setFieldId(e.target.value)}
                options={fields.map(f => ({ value: f.id, name: f.name }))}
                placeholder={t`Select a field`}
              />
              <Text size="sm" mt={1} color="text-light">
                {t`Rows in this table will be filtered based on this field's value.`}
              </Text>
            </div>

            <div>
              <Text weight="bold" mb={2}>{t`What property of the user group should field values be compared to?`}</Text>
              <Select
                value={groupAttribute}
                onChange={(e) => setGroupAttribute(e.target.value)}
                options={groupAttributes}
              />
              <Text size="sm" mt={1} color="text-light">
                {t`Values in the selected field will be compared against this group property.`}
              </Text>
            </div>

            <Box mt="lg">
              <Button primary onClick={handleSave}>{t`Save`}</Button>
              <Button ml={2} onClick={onClose}>{t`Cancel`}</Button>
            </Box>
          </Stack>
        </Box>
      </ModalContent>
    </Modal>
  );
};

EditSandboxingModal.propTypes = {
  table: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialMapping: PropTypes.shape({
    fieldId: PropTypes.number,
    groupAttribute: PropTypes.string
  })
};

export default EditSandboxingModal; 