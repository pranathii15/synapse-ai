from app.services.user_service import users_collection


def recommend_members(required_skills):

    users = list(
        users_collection.find(
            {},
            {
                "password": 0
            }
        )
    )

    recommendations = []

    required_skills = [skill.lower() for skill in required_skills]

    for user in users:

        skills = [skill.lower() for skill in user.get("skills", [])]

        matched_skills = list(
            set(required_skills).intersection(set(skills))
        )

        matched = len(matched_skills)

        # Skill score
        score = matched * 20

        # Experience bonus
        score += user.get("experience", 0) * 2

        # Lower workload = better recommendation
        score -= user.get("workload", 0) * 3

        recommendations.append({

            "name": user.get("name", "Unknown"),

            "email": user.get("email", ""),

            "role": user.get("role", "Employee"),

            "department": user.get("department", ""),

            "experience": user.get("experience", 0),

            "workload": user.get("workload", 0),

            "score": score,

            "matched_skills": matched_skills

        })

    recommendations.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return recommendations[:3]