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
  "API Key": "APIキー",
  "Key Alias": "キーエイリアス",
  "Max Budget (USD)": "最大予算（USD）",
  "TPM Limit": "TPM制限",
  "RPM Limit": "RPM制限",
  "Expire Key (eg: 30s, 30h, 30d)": "キー有効期限（例：30s、30h、30d）",
  "Copy API Key": "APIキーをコピー",
  "Regenerate API Key": "APIキーを再生成",
  "API Key copied to clipboard": "APIキーがクリップボードにコピーされました",
  "API Key regenerated successfully": "APIキーが正常に再生成されました",
  "Failed to regenerate API Key": "APIキーの再生成に失敗しました",
  "No alias set": "エイリアスが設定されていません",
  "Create New Key": "新しいキーを作成",
  "Filters": "フィルター",
  "Reset Filters": "フィルターをリセット",
  "Key ID": "キーID",
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
  "results": "結果"
};

export const useTranslation = () => {
  const t = (key: string): string => {
    return japaneseTranslations[key] || key;
  };

  return { t };
};

export const translate = (key: string): string => {
  return japaneseTranslations[key] || key;
};

export const autoTranslatePage = () => {
  const translateTextNodes = (element: Element) => {
    const walker = document.createTreeWalker(
      element,
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

  translateTextNodes(document.body);
  
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          translateTextNodes(node as Element);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoTranslatePage);
  } else {
    autoTranslatePage();
  }
}
