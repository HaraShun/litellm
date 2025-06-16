import { Layout, Menu } from "antd";
import Link from "next/link";
import { List } from "postcss/lib/list";
import { Text } from "@tremor/react";
import { 
  KeyOutlined,
  PlayCircleOutlined,
  BlockOutlined,
  BarChartOutlined,
  TeamOutlined,
  BankOutlined,
  UserOutlined,
  SettingOutlined,
  ApiOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  LineOutlined,
  LineChartOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  LockOutlined,
  ToolOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { old_admin_roles, v2_admin_role_names, all_admin_roles, rolesAllowedToSeeUsage, rolesWithWriteAccess, internalUserRoles } from '../utils/roles';
import UsageIndicator from './usage_indicator';
const { Sider } = Layout;

// Define the props type
interface SidebarProps {
  accessToken: string | null;
  setPage: (page: string) => void;
  userRole: string;
  defaultSelectedKey: string;
}

// Create a more comprehensive menu item configuration
interface MenuItem {
  key: string;
  page: string;
  label: string;
  roles?: string[];
  children?: MenuItem[];  // Add children property for submenus
  icon?: React.ReactNode;
}



const Sidebar: React.FC<SidebarProps> = ({
  accessToken,
  setPage,
  userRole,
  defaultSelectedKey,
}) => {
  // Note: If a menu item does not have a role, it is visible to all roles.
  const menuItems: MenuItem[] = [
    { key: "1", page: "api-keys", label: "バーチャルキー", icon: <KeyOutlined /> },
    { key: "3", page: "llm-playground", label: "キーテスト", icon: <PlayCircleOutlined />, roles: rolesWithWriteAccess },
    { key: "2", page: "models", label: "モデル", icon: <BlockOutlined />, roles: rolesWithWriteAccess },
    { key: "12", page: "new_usage", label: "使用量", icon: <BarChartOutlined />, roles: [...all_admin_roles, ...internalUserRoles] },
    { key: "6", page: "teams", label: "チーム", icon: <TeamOutlined /> },
    { key: "17", page: "organizations", label: "組織", icon: <BankOutlined />, roles: all_admin_roles },
    { key: "5", page: "users", label: "内部ユーザー", icon: <UserOutlined />, roles: all_admin_roles },
    { key: "14", page: "api_ref", label: "APIリファレンス", icon: <ApiOutlined /> },
    { key: "16", page: "model-hub", label: "モデルハブ", icon: <AppstoreOutlined /> },
    { key: "15", page: "logs", label: "ログ", icon: <LineChartOutlined />},
    { key: "11", page: "guardrails", label: "ガードレール", icon: <SafetyOutlined />, roles: all_admin_roles },
    { key: "18", page: "mcp-servers", label: "MCPサーバー", icon: <ToolOutlined />, roles: all_admin_roles },
    { 
      key: "experimental", 
      page: "experimental",
      label: "実験的機能", 
      icon: <ExperimentOutlined />,
      children: [
        { key: "9", page: "caching", label: "キャッシュ", icon: <DatabaseOutlined />, roles: all_admin_roles },
        { key: "10", page: "budgets", label: "予算", icon: <BankOutlined />, roles: all_admin_roles },
        { key: "20", page: "transform-request", label: "APIプレイグラウンド", icon: <ApiOutlined />, roles: [...all_admin_roles, ...internalUserRoles] },
        { key: "19", page: "tag-management", label: "タグ管理", icon: <TagsOutlined />, roles: all_admin_roles },
        { key: "21", page: "vector-stores", label: "ベクターストア", icon: <DatabaseOutlined />, roles: all_admin_roles },
        { key: "4", page: "usage", label: "旧使用量", icon: <BarChartOutlined /> },
      ]
    },
    {
      key: "settings",
      page: "settings",
      label: "設定",
      icon: <SettingOutlined />,
      roles: all_admin_roles,
      children: [
        { key: "11", page: "general-settings", label: "ルーター設定", icon: <SettingOutlined />, roles: all_admin_roles },
        { key: "12", page: "pass-through-settings", label: "パススルー", icon: <ApiOutlined />, roles: all_admin_roles },
        { key: "8", page: "settings", label: "ログ・アラート", icon: <SettingOutlined />, roles: all_admin_roles },
        { key: "13", page: "admin-panel", label: "管理者設定", icon: <SettingOutlined />, roles: all_admin_roles },
      ]
    }
  ];
  // Find the menu item that matches the default page, including in submenus
  const findMenuItemKey = (page: string): string => {
    // Check top-level items
    const topLevelItem = menuItems.find(item => item.page === page);
    if (topLevelItem) return topLevelItem.key;

    // Check submenu items
    for (const item of menuItems) {
      if (item.children) {
        const childItem = item.children.find(child => child.page === page);
        if (childItem) return childItem.key;
      }
    }
    return "1"; // Default to first item if not found
  };

  const selectedMenuKey = findMenuItemKey(defaultSelectedKey);

  const filteredMenuItems = menuItems.filter(item => {
    // Check if parent item has roles and user has access
    const hasParentAccess = !item.roles || item.roles.includes(userRole);
    
    if (!hasParentAccess) return false;

    // Filter children if they exist
    if (item.children) {
      item.children = item.children.filter(child => 
        !child.roles || child.roles.includes(userRole)
      );
    }

    return true;
  });


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" width={220}>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          defaultOpenKeys={["llm-tools"]}
          style={{ 
            borderRight: 0,
            backgroundColor: 'transparent',
            fontSize: '14px',
          }}
          items={filteredMenuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            children: item.children?.map(child => ({
              key: child.key,
              icon: child.icon,
              label: child.label,
              onClick: () => {
                const newSearchParams = new URLSearchParams(window.location.search);
                newSearchParams.set('page', child.page);
                window.history.pushState(null, '', `?${newSearchParams.toString()}`);
                setPage(child.page);
              }
            })),
            onClick: !item.children ? () => {
              const newSearchParams = new URLSearchParams(window.location.search);
              newSearchParams.set('page', item.page);
              window.history.pushState(null, '', `?${newSearchParams.toString()}`);
              setPage(item.page);
            } : undefined
          }))}
        />
        <UsageIndicator accessToken={accessToken} width={220}/>
      </Sider>
    </Layout>
  );
};

export default Sidebar;
