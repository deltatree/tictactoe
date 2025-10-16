import React from 'react';
import type { Achievement } from '../../types/game.types';
import './Achievements.css';

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="achievements">
      <h3>🏅 Erfolge</h3>
      <p className="achievements-progress">
        {unlockedCount} / {totalCount} freigeschaltet
      </p>

      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            title={achievement.description}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-details">
              <div className="achievement-name">{achievement.name}</div>
              <div className="achievement-description">{achievement.description}</div>
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="achievement-unlocked-date">
                  {new Date(achievement.unlockedAt).toLocaleDateString('de-DE')}
                </div>
              )}
            </div>
            {achievement.unlocked && (
              <div className="achievement-check">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
