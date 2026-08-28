import { useMemo, useState } from 'react'
import { calculateDiagnosis, categories, questions } from './data/diagnosis.js'

function SiteHeader({ onHome }) {
  return (
    <header className="site-header">
      <button className="brand" type="button" onClick={onHome}>
        <span className="brand-mark" aria-hidden="true">DX</span>
        <span>
          <strong>自治体DX課題診断</strong>
          <small>Municipal DX Check</small>
        </span>
      </button>
      <span className="version-label">v0.1</span>
    </header>
  )
}

function Intro() {
  return (
    <section className="hero" aria-labelledby="page-title">
      <div className="hero-copy">
        <p className="eyebrow">まずは課題の見える化から</p>
        <h1 id="page-title">
          日々の困りごとから、
          <span>DXの優先順位</span>を整理します。
        </h1>
        <p className="hero-description">
          当てはまる項目を選ぶだけで、改善の優先度とおすすめ施策を確認できます。
          専門知識は必要ありません。
        </p>
        <div className="hero-meta" aria-label="診断の概要">
          <span><b>8</b>つの質問</span>
          <span><b>約2分</b>で完了</span>
          <span><b>無料</b>・登録不要</span>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="visual-orbit orbit-one" />
        <div className="visual-orbit orbit-two" />
        <div className="visual-card card-main">
          <span>DX改善優先度</span>
          <strong>72</strong>
          <small>/ 100</small>
        </div>
        <div className="visual-card card-sub">課題を整理</div>
        <div className="visual-card card-sub card-sub-two">施策を提案</div>
      </div>
    </section>
  )
}

function Questionnaire({ selectedIds, onToggle, onSubmit, error }) {
  return (
    <section className="question-section" aria-labelledby="question-title">
      <div className="section-heading">
        <div>
          <p className="step-label">STEP 1</p>
          <h2 id="question-title">現在の課題を選んでください</h2>
          <p>「よくある」「負担に感じる」と思う項目すべてにチェックしてください。</p>
        </div>
        <div className="selection-count" aria-live="polite">
          <strong>{selectedIds.length}</strong>
          <span>/ {questions.length} 項目を選択</span>
        </div>
      </div>

      <div className="question-grid">
        {questions.map((question) => {
          const checked = selectedIds.includes(question.id)
          const category = categories[question.category]

          return (
            <label
              className={`question-card${checked ? ' is-selected' : ''}`}
              key={question.id}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(question.id)}
              />
              <span className="custom-check" aria-hidden="true">✓</span>
              <span className="question-content">
                <span className="category-tag" style={{ '--tag-color': category.color }}>
                  {category.label}
                </span>
                <strong>{question.title}</strong>
                <small>{question.description}</small>
              </span>
            </label>
          )
        })}
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="submit-area">
        <button className="primary-button" type="button" onClick={onSubmit}>
          診断結果を見る
          <span aria-hidden="true">→</span>
        </button>
        <p>選択内容は保存・送信されません</p>
      </div>
    </section>
  )
}

function Result({ diagnosis, onReset }) {
  const topPriorities = diagnosis.priorities.slice(0, 3)

  return (
    <main className="result-page">
      <section className="result-hero" aria-labelledby="result-title">
        <div>
          <p className="step-label">DIAGNOSIS RESULT</p>
          <h1 id="result-title">診断結果</h1>
          <p>{diagnosis.selectedCount}項目の課題から、取り組みの優先順位を整理しました。</p>
        </div>
        <div className={`score-ring ${diagnosis.level.tone}`} style={{ '--score': diagnosis.score }}>
          <div>
            <span>DX改善優先度</span>
            <strong>{diagnosis.score}</strong>
            <small>/ 100</small>
          </div>
        </div>
      </section>

      <section className="result-summary" aria-label="診断の要約">
        <span className={`level-badge ${diagnosis.level.tone}`}>{diagnosis.level.label}</span>
        <h2>{diagnosis.level.message}</h2>
        <p>
          この結果は簡易診断です。最初からすべてを変えるのではなく、
          効果が見えやすい小さな範囲で試し、現場の声をもとに広げていきましょう。
        </p>
      </section>

      <section className="priority-section" aria-labelledby="priority-title">
        <div className="section-heading compact">
          <div>
            <p className="step-label">PRIORITIES</p>
            <h2 id="priority-title">優先して取り組む領域</h2>
          </div>
        </div>

        <div className="priority-grid">
          {topPriorities.map((priority, index) => (
            <article className="priority-card" key={priority.key}>
              <div className="priority-card-top">
                <span className="rank">{String(index + 1).padStart(2, '0')}</span>
                <span className="priority-score" style={{ '--priority-color': priority.color }}>
                  {priority.score} pt
                </span>
              </div>
              <h3>{priority.shortLabel}</h3>
              <p>{priority.summary}</p>
              <div className="action-list">
                <strong>おすすめ施策</strong>
                <ul>
                  {priority.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="next-step">
        <div>
          <p className="step-label">NEXT STEP</p>
          <h2>まずは、最優先領域の現状整理から</h2>
          <p>
            担当者・作業時間・利用中の道具を書き出すと、改善する範囲が見えやすくなります。
          </p>
        </div>
        <button className="secondary-button" type="button" onClick={onReset}>
          もう一度診断する
        </button>
      </section>
    </main>
  )
}

function App() {
  const [selectedIds, setSelectedIds] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [error, setError] = useState('')

  const diagnosis = useMemo(
    () => calculateDiagnosis(selectedIds),
    [selectedIds],
  )

  const toggleQuestion = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    )
    setError('')
  }

  const submitDiagnosis = () => {
    if (selectedIds.length === 0) {
      setError('当てはまる項目を1つ以上選んでください。')
      return
    }

    setShowResult(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetDiagnosis = () => {
    setSelectedIds([])
    setShowResult(false)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <SiteHeader onHome={resetDiagnosis} />
      {showResult ? (
        <Result diagnosis={diagnosis} onReset={resetDiagnosis} />
      ) : (
        <main>
          <Intro />
          <Questionnaire
            selectedIds={selectedIds}
            onToggle={toggleQuestion}
            onSubmit={submitDiagnosis}
            error={error}
          />
        </main>
      )}
      <footer>
        <p>自治体DX課題診断 <span>— 課題整理のための簡易ツール</span></p>
        <small>© 2026 Municipal DX Check</small>
      </footer>
    </div>
  )
}

export default App
