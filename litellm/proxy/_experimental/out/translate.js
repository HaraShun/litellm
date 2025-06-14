const japaneseTranslations = {
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
  "No data": "データなし"
};

function translatePage() {
  console.log('Running Japanese translation...');
  
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }

  let translatedCount = 0;
  textNodes.forEach(textNode => {
    const text = textNode.textContent?.trim();
    if (text && japaneseTranslations[text]) {
      console.log(`Translating: "${text}" -> "${japaneseTranslations[text]}"`);
      textNode.textContent = japaneseTranslations[text];
      translatedCount++;
    }
  });
  
  console.log(`Translated ${translatedCount} text nodes to Japanese`);
  return translatedCount;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', translatePage);
} else {
  translatePage();
}

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        setTimeout(translatePage, 100);
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('Japanese translation script loaded successfully');
