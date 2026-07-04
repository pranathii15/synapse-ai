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
      const response = await api.post('/recommend/team', { 
        project_name: requirements, 
        required_skills: skills 
      });
      if (response.data && Array.isArray(response.data.recommended_members)) {
        const team = getTeam();
        return response.data.recommended_members.map((rec: any) => {
          const found = team.find(m => m.name.toLowerCase() === rec.name.toLowerCase());
          const member: TeamMember = found || {
            id: 'm_' + Math.random().toString(36).substr(2, 9),
            name: rec.name,
            role: rec.role || 'Specialist',
            department: rec.department || 'Engineering',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=facearea&facepad=2',
            skills: rec.matched_skills || skills,
            currentWorkload: rec.workload || 0,
            experience: `${rec.experience || 0} years`
          };
          return {
            member,
            score: rec.score,
            reason: `Matches skills: ${(rec.matched_skills || []).join(', ') || 'General'}. Current workload of ${rec.workload}% with ${rec.experience} years of experience.`
          };
        });
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
