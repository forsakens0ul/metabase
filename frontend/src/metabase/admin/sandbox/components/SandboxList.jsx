import { useEffect, useState } from "react";
import { t } from "ttag";
import { Link } from "react-router";
import { Button, Icon, Alert } from "metabase/ui";
import { getSandboxPolicies, deleteSandboxPolicy } from "../api";

const SandboxList = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const data = await getSandboxPolicies();
      setPolicies(data);
      setError(null);
    } catch (err) {
      setError(err.message || t`加载失败`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t`确定要删除这个策略吗？`)) {
      try {
        await deleteSandboxPolicy(id);
        await loadPolicies();
      } catch (err) {
        setError(err.message || t`删除失败`);
      }
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  if (loading) {
    return (
      <div className="p4">
        <div className="flex align-center">
          <Icon name="spinner" className="mr2" />
          {t`加载中...`}
        </div>
      </div>
    );
  }

  return (
    <div className="p4">
      <div className="flex justify-between align-center mb4">
        <h2>{t`沙盒策略`}</h2>
        <Link to="/admin/sandbox/new">
          <Button primary>
            <Icon name="add" className="mr1" />
            {t`新建策略`}
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="error" className="mb4">
          {error}
        </Alert>
      )}

      <div className="bordered rounded">
        <table className="full">
          <thead>
            <tr>
              <th>{t`用户组`}</th>
              <th>{t`表`}</th>
              <th>{t`过滤条件`}</th>
              <th>{t`操作`}</th>
            </tr>
          </thead>
          <tbody>
            {policies.map(policy => (
              <tr key={policy.id}>
                <td>{policy.group_name}</td>
                <td>{policy.table_name}</td>
                <td>
                  <code>{policy.filter_condition}</code>
                </td>
                <td>
                  <div className="flex align-center">
                    <Link
                      to={`/admin/sandbox/${policy.id}`}
                      className="Button Button--small mr2"
                    >
                      {t`编辑`}
                    </Link>
                    <Button
                      small
                      danger
                      onClick={() => handleDelete(policy.id)}
                    >
                      {t`删除`}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {policies.length === 0 && (
              <tr>
                <td colSpan="4" className="text-centered text-muted py4">
                  {t`暂无沙盒策略`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SandboxList; 