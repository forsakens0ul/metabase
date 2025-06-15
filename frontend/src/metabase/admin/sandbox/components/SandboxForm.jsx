import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { t } from "ttag";

import { get, post, put } from "metabase/lib/api";
import { Button, Select, TextInput } from "metabase/ui";

const SandboxForm = (props) => {
  // 兼容 props 传参和路由 params
  const policyId = props.policyId || (props.params && props.params.id);
  const [groups, setGroups] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    group_id: null,
    table_id: null,
    attribute_remappings: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsData, tablesData] = await Promise.all([
          get("/api/permissions/group"),
          get("/api/table"),
        ]);

        setGroups(groupsData);
        setTables(tablesData);

        if (policyId) {
          // 编辑模式
          const policy = await get(`/api/sandbox/${policyId}`);
          setFormData({
            name: policy.name,
            description: policy.description,
            group_id: policy.group_id,
            table_id: policy.table_id,
            attribute_remappings: policy.attribute_remappings,
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [policyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (policyId) {
        await put(`/api/sandbox/${policyId}`, formData);
      } else {
        await post("/api/sandbox", formData);
      }

      if (props.onSuccess) {
        props.onSuccess();
      }
      // 跳转回列表页
      if (props.history && props.history.push) {
        props.history.push("/admin/sandbox");
      } else if (window.history) {
        window.history.back();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>{t`加载中...`}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p4">
      <h2>{policyId ? t`编辑策略` : t`新建策略`}</h2>
      {error && <div className="text-error mb4">{error}</div>}

      <div className="mb4">
        <label className="block mb2">{t`名称`}</label>
        <TextInput
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t`输入策略名称`}
          required
        />
      </div>

      <div className="mb4">
        <label className="block mb2">{t`描述`}</label>
        <TextInput
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder={t`输入策略描述`}
        />
      </div>

      <div className="mb4">
        <label className="block mb2">{t`用户组`}</label>
        <Select
          value={formData.group_id}
          onChange={(value) =>
            setFormData({ ...formData, group_id: Number(value) })
          }
          data={groups.map((group) => ({ value: group.id, label: group.name }))}
          required
        />
      </div>

      <div className="mb4">
        <label className="block mb2">{t`表`}</label>
        <Select
          value={formData.table_id}
          onChange={(value) =>
            setFormData({ ...formData, table_id: Number(value) })
          }
          data={tables.map((table) => ({ value: table.id, label: table.name }))}
          required
        />
      </div>

      <div className="mb4">
        <label className="block mb2">{t`属性映射`}</label>
        <TextInput
          value={JSON.stringify(formData.attribute_remappings)}
          onChange={(e) => {
            try {
              const value = JSON.parse(e.target.value);
              setFormData({ ...formData, attribute_remappings: value });
            } catch (err) {
              // 如果 JSON 解析失败，保持原值
            }
          }}
          placeholder='{"user_id": "{{current_user_id}}"}'
          required
        />
        <div className="text-muted mt1">
          {t`输入 JSON 格式的属性映射，可用 {{current_user_id}} 代表当前用户ID`}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="filled">
          {policyId ? t`更新策略` : t`创建策略`}
        </Button>
      </div>
    </form>
  );
};

SandboxForm.propTypes = {
  policyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  params: PropTypes.object,
  onSuccess: PropTypes.func,
  history: PropTypes.object,
};

export default SandboxForm;
