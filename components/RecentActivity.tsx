"use client";

import React from "react";
import { useRecentActivity } from "./hooks/useRecentActivity";

type Props = {
  limit?: number;
  className?: string;
};

/**
 * BotExcel kullanıcı panelinde "Son İşlemler / Recent Jobs" listesini gösteren bileşen.
 *
 * Örnek backend alanları:
 * - id
 * - source_file veya original_filename
 * - file_type
 * - status
 * - created_at / finished_at
 */
export const RecentActivity: React.FC<Props> = ({ limit = 10, className }) => {
  const { loading, error, items } = useRecentActivity(limit);

  return (
    <section className={className ?? "recent-section"}>
      <header className="recent-header">
        <h2 className="recent-title">Son işlemleriniz</h2>
        <p className="recent-subtitle">
          BotExcel ile en son dönüştürdüğünüz belgelerin özetini burada görürsünüz.
        </p>
      </header>

      {loading && (
        <div className="recent-state recent-loading">
          <span className="spinner" aria-hidden="true" />
          <span>Veriler yükleniyor…</span>
        </div>
      )}

      {error && !loading && (
        <div className="recent-state recent-error">
          <strong>Bir şeyler ters gitti:</strong>
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="recent-state recent-empty">
          <span>Henüz hiç işlem yapmamışsınız.</span>
          <span>İlk belgenizi yükleyerek başlayın.</span>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="recent-list">
          {items.map((item, idx) => {
            const key = String(item.id ?? idx);
            const name =
              item.original_filename ||
              item.source_file ||
              `Belge #${key}`;
            const status = item.status ?? "tamamlandı";
            const type = item.file_type ?? "bilinmiyor";
            const created =
              item.created_at &&
              new Date(item.created_at).toLocaleString("tr-TR");

            return (
              <article key={key} className="recent-item">
                <div className="recent-item-main">
                  <div className="recent-item-name">{name}</div>
                  <div className="recent-item-meta">
                    <span className="recent-chip recent-chip-type">
                      {type.toUpperCase()}
                    </span>
                    <span className="recent-chip recent-chip-status">
                      {status}
                    </span>
                    {created && (
                      <span className="recent-chip recent-chip-date">
                        {created}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecentActivity;
