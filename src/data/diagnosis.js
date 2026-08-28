export const categories = {
  process: {
    label: '業務プロセス',
    shortLabel: '業務効率化',
    color: '#147d92',
    summary: '申請・承認の流れを見直し、職員と住民双方の負担を減らす領域です。',
    actions: [
      '申請・届出をオンライン化する',
      '承認フローと重複作業を棚卸しする',
    ],
  },
  data: {
    label: 'データ活用・共有',
    shortLabel: 'データ統合',
    color: '#3867c8',
    summary: '散在する情報を整理し、安全に共有・更新できる状態をつくる領域です。',
    actions: [
      '台帳・顧客情報の管理場所を一元化する',
      'データの更新ルールと閲覧権限を定める',
    ],
  },
  service: {
    label: '住民サービス',
    shortLabel: '窓口・問い合わせ',
    color: '#7a57b8',
    summary: '問い合わせや来庁の負担を減らし、必要な情報へ迷わず到達できるようにします。',
    actions: [
      'よくある質問を整理してWebで公開する',
      '予約・問い合わせのオンライン窓口を設ける',
    ],
  },
  communication: {
    label: '情報発信',
    shortLabel: '情報発信',
    color: '#b55f36',
    summary: '住民に必要な情報を、適切なタイミングと手段で届ける領域です。',
    actions: [
      '対象者ごとに発信内容と媒体を整理する',
      'Web・SNSの閲覧データを改善に活かす',
    ],
  },
}

export const questions = [
  {
    id: 'paper-work',
    category: 'process',
    weight: 15,
    title: '紙の申請や押印が多い',
    description: '受付後の転記や書類の回覧にも時間がかかっている',
  },
  {
    id: 'duplicate-entry',
    category: 'process',
    weight: 13,
    title: '同じ内容を何度も入力している',
    description: '複数の台帳・システムへの転記や二重入力が発生している',
  },
  {
    id: 'personal-files',
    category: 'data',
    weight: 14,
    title: 'Excelや個人フォルダに情報が分散している',
    description: '担当者以外は、最新情報の場所や見方が分からない',
  },
  {
    id: 'department-silo',
    category: 'data',
    weight: 13,
    title: '部署間でデータを共有できていない',
    description: '似た情報を別々に保有し、横断的な活用が難しい',
  },
  {
    id: 'repeat-inquiries',
    category: 'service',
    weight: 12,
    title: '同じ問い合わせへの対応が多い',
    description: '電話や窓口で、定型的な質問に繰り返し回答している',
  },
  {
    id: 'limited-hours',
    category: 'service',
    weight: 11,
    title: '手続きが開庁時間に限られている',
    description: '来庁しなければ完了できない申請や相談が多い',
  },
  {
    id: 'information-reach',
    category: 'communication',
    weight: 12,
    title: '必要な人に情報が届いていない',
    description: 'WebやSNSで発信しても、制度や催しが十分に認知されない',
  },
  {
    id: 'slow-updates',
    category: 'communication',
    weight: 10,
    title: '情報更新に手間と時間がかかる',
    description: '発信までの確認工程が多く、タイムリーに更新できない',
  },
]

export function calculateDiagnosis(selectedIds) {
  const selectedQuestions = questions.filter((question) =>
    selectedIds.includes(question.id),
  )

  const categoryScores = Object.keys(categories).reduce((scores, key) => {
    scores[key] = selectedQuestions
      .filter((question) => question.category === key)
      .reduce((total, question) => total + question.weight, 0)
    return scores
  }, {})

  const priorities = Object.entries(categoryScores)
    .filter(([, score]) => score > 0)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([key, score]) => ({ key, score, ...categories[key] }))

  const score = selectedQuestions.reduce(
    (total, question) => total + question.weight,
    0,
  )

  let level = {
    label: '改善の余地は限定的',
    tone: 'low',
    message: '現在の運用を維持しながら、小さな不便を継続的に確認しましょう。',
  }

  if (score >= 76) {
    level = {
      label: '最優先で改善',
      tone: 'urgent',
      message: '複数領域に課題があります。優先領域を決め、段階的に改善を始めましょう。',
    }
  } else if (score >= 51) {
    level = {
      label: '優先度は高め',
      tone: 'high',
      message: '業務への影響が大きい状態です。上位の課題から具体策を検討しましょう。',
    }
  } else if (score >= 26) {
    level = {
      label: '計画的に改善',
      tone: 'medium',
      message: '改善効果が見込めます。取り組みやすい施策から試すのがおすすめです。',
    }
  }

  return { score, priorities, level, selectedCount: selectedQuestions.length }
}
