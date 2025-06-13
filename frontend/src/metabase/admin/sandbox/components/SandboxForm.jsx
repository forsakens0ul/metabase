import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { t } from "ttag";

import { Button, Select, TextInput } from "metabase/ui";

import {
  createSandboxPolicy,
  getGroups,
  getSandboxPolicy,
  getTables,
  updateSandboxPolicy,
} from "../api";

const SandboxForm = (props) => {
  // 兼容 props 传参和路由 params
  const policyId = props.policyId || (props.params && props.params.id);
  const [groups, setGroups] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    group_id: null,
    table_id: null,
    filter_condition: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsData, tablesData] = await Promise.all([
          getGroups(),
          getTables(),
        ]);
        setGroups(groupsData);
        setTables(tablesData);
        if (policyId) {
          // 编辑模式
          const policy = await getSandboxPolicy(policyId);
          setFormData({
            group_id: policy.group_id,
            table_id: policy.table_id,
            filter_condition: policy.filter_condition,
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
        await updateSandboxPolicy(policyId, formData);
      } else {
        await createSandboxPolicy(formData);
      }
      if (props.onSuccess) {props.onSuccess();}
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
        <label className="block mb2">{t`用户组`}</label>
        <Select
          value={formData.group_id}
          onChange={value => setFormData({ ...formData, group_id: Number(value) })}
          data={groups.map(group => ({ value: group.id, label: group.name }))}
          required
        />
      </div>
      <div className="mb4">
        <label className="block mb2">{t`表`}</label>
        <Select
          value={formData.table_id}
          onChange={value => setFormData({ ...formData, table_id: Number(value) })}
          data={tables.map(table => ({ value: table.id, label: table.name }))}
          required
        />
      </div>
      <div className="mb4">
        <label className="block mb2">{t`过滤条件`}</label>
        <TextInput
          value={formData.filter_condition}
          onChange={e => setFormData({ ...formData, filter_condition: e.target.value })}
          placeholder="user_id = {{current_user_id}}"
          required
        />
        <div className="text-muted mt1">
          {t`可用 {{current_user_id}} 代表当前用户ID`}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" primary>
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