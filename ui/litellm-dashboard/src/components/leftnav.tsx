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
import { useTranslation } from '../hooks/useTranslation';
import { useEffect } from 'react';
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
  const { t } = useTranslation();
  
  useEffect(() => {
    const japaneseTranslations: Record<string, string> = {
      "Virtual Keys": "バーチャルキー",
      "Test Key": "テストキー",
      "Models": "モデル",
      "Usage": "使用状況",
      "Teams": "チーム",
      "Organizations": "組織",
      "Internal Users": "内部ユーザー",
      "API Reference": "API リファレンス",
      "Model Hub": "モデルハブ",
      "Logs": "ログ",
      "Guardrails": "ガードレール",
      "MCP Servers": "MCPサーバー",
      "Experimental": "実験的",
      "Settings": "設定",
      "Caching": "キャッシュ",
      "Budgets": "予算",
      "API Playground": "APIプレイグラウンド",
      "Tag Management": "タグ管理",
      "Vector Stores": "ベクターストア",
      "Old Usage": "旧使用状況",
      "Router Settings": "ルーター設定",
      "Pass-Through": "パススルー",
      "Logging & Alerts": "ログとアラート",
      "Admin Settings": "管理者設定",
      "Create New Key": "新しいキーを作成",
      "Filters": "フィルター",
      "Reset Filters": "フィルターをリセット",
      "Key ID": "キーID",
      "Key Alias": "キーエイリアス",
      "Secret Key": "シークレットキー",
      "Team Alias": "チームエイリアス",
      "Team ID": "チームID",
      "Organization ID": "組織ID",
      "User Email": "ユーザーメール",
      "User ID": "ユーザーID",
      "Created At": "作成日時",
      "Created By": "作成者",
      "Updated At": "更新日時",
      "Expires": "有効期限",
      "Spend (USD)": "支出（USD）",
      "Budget (USD)": "予算（USD）",
      "Budget Reset": "予算リセット",
      "Rate Limits": "レート制限",
      "No keys found": "キーが見つかりません",
      "Previous": "前へ",
      "Next": "次へ",
      "Page": "ページ",
      "Showing": "表示中",
      "of": "の",
      "results": "結果",
      "No data": "データなし",
      "LLM Tools": "LLMツール",
      "Docs": "ドキュメント",
      "User": "ユーザー"
    };

    const translatePage = () => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      );

      const textNodes: Text[] = [];
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node as Text);
      }

      textNodes.forEach(textNode => {
        const text = textNode.textContent?.trim();
        if (text && japaneseTranslations[text]) {
          textNode.textContent = japaneseTranslations[text];
        }
      });
    };

    translatePage();
    const intervalId = setInterval(translatePage, 500);
    
    const observer = new MutationObserver(() => {
      setTimeout(translatePage, 50);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', translatePage);
    }

    return () => {
      clearInterval(intervalId);
      observer.disconnect();
      document.removeEventListener('DOMContentLoaded', translatePage);
    };
  }, []);
  
  // Note: If a menu item does not have a role, it is visible to all roles.
  const menuItems: MenuItem[] = [
    { key: "1", page: "api-keys", label: t("Virtual Keys"), icon: <KeyOutlined /> },
    { key: "3", page: "llm-playground", label: t("Test Key"), icon: <PlayCircleOutlined />, roles: rolesWithWriteAccess },
    { key: "2", page: "models", label: t("Models"), icon: <BlockOutlined />, roles: rolesWithWriteAccess },
    { key: "12", page: "new_usage", label: t("Usage"), icon: <BarChartOutlined />, roles: [...all_admin_roles, ...internalUserRoles] },
    { key: "6", page: "teams", label: t("Teams"), icon: <TeamOutlined /> },
    { key: "17", page: "organizations", label: t("Organizations"), icon: <BankOutlined />, roles: all_admin_roles },
    { key: "5", page: "users", label: t("Internal Users"), icon: <UserOutlined />, roles: all_admin_roles },
    { key: "14", page: "api_ref", label: t("API Reference"), icon: <ApiOutlined /> },
    { key: "16", page: "model-hub", label: t("Model Hub"), icon: <AppstoreOutlined /> },
    { key: "15", page: "logs", label: t("Logs"), icon: <LineChartOutlined />},
    { key: "11", page: "guardrails", label: t("Guardrails"), icon: <SafetyOutlined />, roles: all_admin_roles },
    { key: "18", page: "mcp-servers", label: t("MCP Servers"), icon: <ToolOutlined />, roles: all_admin_roles },
    { 
      key: "experimental", 
      page: "experimental",
      label: t("Experimental"), 
      icon: <ExperimentOutlined />,
      children: [
        { key: "9", page: "caching", label: t("Caching"), icon: <DatabaseOutlined />, roles: all_admin_roles },
        { key: "10", page: "budgets", label: t("Budgets"), icon: <BankOutlined />, roles: all_admin_roles },
        { key: "20", page: "transform-request", label: t("API Playground"), icon: <ApiOutlined />, roles: [...all_admin_roles, ...internalUserRoles] },
        { key: "19", page: "tag-management", label: t("Tag Management"), icon: <TagsOutlined />, roles: all_admin_roles },
        { key: "21", page: "vector-stores", label: t("Vector Stores"), icon: <DatabaseOutlined />, roles: all_admin_roles },
        { key: "4", page: "usage", label: t("Old Usage"), icon: <BarChartOutlined /> },
      ]
    },
    {
      key: "settings",
      page: "settings",
      label: t("Settings"),
      icon: <SettingOutlined />,
      roles: all_admin_roles,
      children: [
        { key: "11", page: "general-settings", label: t("Router Settings"), icon: <SettingOutlined />, roles: all_admin_roles },
        { key: "12", page: "pass-through-settings", label: t("Pass-Through"), icon: <ApiOutlined />, roles: all_admin_roles },
        { key: "8", page: "settings", label: t("Logging & Alerts"), icon: <SettingOutlined />, roles: all_admin_roles },
        { key: "13", page: "admin-panel", label: t("Admin Settings"), icon: <SettingOutlined />, roles: all_admin_roles },
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
