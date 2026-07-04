import { api } from '../lib/api';
import { TeamMember } from '../types';
import { getTeam } from './mockDb';

export interface RecommendationResult {
  member: TeamMember;
  score: number;
  reason: string;
}

export const recommendationService = {
  getRecommendations: async (requirements: string, skills: string[], minExperienceYears: number): Promise<RecommendationResult[]> => {
    try {
      const response = await api.post('/recommendations', { requirements, skills, min_experience_years: minExperienceYears });
      if (Array.isArray(response.data)) {
        return response.data;
      }
    } catch (error) {
      console.warn('Could not post recommendations query via API, matching via local heuristic fallback instead.', error);
    }

    const team = getTeam();
    const recommendations: RecommendationResult[] = team.map(member => {
      let score = 50; // base score
      const matchingSkills = member.skills.filter(s => 
        skills.some(req => s.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(s.toLowerCase()))
      );
      
      score += matchingSkills.length * 15;
      
      // Workload factor
      const workloadScore = Math.max(0, (100 - member.currentWorkload) / 2);
      score += workloadScore;
      
      // Experience factor
      const expMatch = member.experience.match(/\d+/);
      const expYears = expMatch ? parseInt(expMatch[0]) : 5;
      if (expYears >= minExperienceYears) {
        score += 10;
      }
      
      score = Math.min(98, Math.round(score));
      
      let reason = '';
      if (matchingSkills.length > 0) {
        reason = `Matches key requested skills (${matchingSkills.join(', ')}). `;
      } else {
        reason = `Selected due to high baseline experience (${member.experience}) and engineering versatility. `;
      }
      
      if (member.currentWorkload < 50) {
        reason += `Excellent bandwidth availability (utilization is only ${member.currentWorkload}%).`;
      } else if (member.currentWorkload > 80) {
        reason += `Has matching expertise but currently carries high workload (${member.currentWorkload}%).`;
      } else {
        reason += `Balanced current workload (${member.currentWorkload}%).`;
      }

      return {
        member,
        score,
        reason
      };
    });

    return recommendations.sort((a, b) => b.score - a.score);
  }
};
