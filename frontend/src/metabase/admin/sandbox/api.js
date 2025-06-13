import { mockPolicies, mockGroups, mockTables } from "./mockData";

// 获取所有沙盒策略
export const getSandboxPolicies = async () => {
  return Promise.resolve(mockPolicies);
};

// 获取单个沙盒策略
export const getSandboxPolicy = async (id) => {
  return Promise.resolve(mockPolicies.find(p => p.id === parseInt(id)));
};

// 创建沙盒策略
export const createSandboxPolicy = async (policy) => {
  const newPolicy = {
    id: mockPolicies.length + 1,
    ...policy,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group_name: mockGroups.find(g => g.id === policy.group_id)?.name || '',
    table_name: mockTables.find(t => t.id === policy.table_id)?.name || '',
  };
  mockPolicies.push(newPolicy);
  return Promise.resolve(newPolicy);
};

// 更新沙盒策略
export const updateSandboxPolicy = async (id, policy) => {
  const idx = mockPolicies.findIndex(p => p.id === parseInt(id));
  if (idx !== -1) {
    mockPolicies[idx] = {
      ...mockPolicies[idx],
      ...policy,
      updated_at: new Date().toISOString(),
      group_name: mockGroups.find(g => g.id === policy.group_id)?.name || '',
      table_name: mockTables.find(t => t.id === policy.table_id)?.name || '',
    };
    return Promise.resolve(mockPolicies[idx]);
  }
  return Promise.reject(new Error('未找到策略'));
};

// 删除沙盒策略
export const deleteSandboxPolicy = async (id) => {
  const idx = mockPolicies.findIndex(p => p.id === parseInt(id));
  if (idx !== -1) {
    mockPolicies.splice(idx, 1);
    return Promise.resolve({ success: true });
  }
  return Promise.reject(new Error('未找到策略'));
};

// 获取所有用户组
export const getGroups = async () => {
  return Promise.resolve(mockGroups);
};

// 获取所有数据表
export const getTables = async () => {
  return Promise.resolve(mockTables);
}; 