import pytest
from apps.portfolio.models import Profile, Project, Stat

@pytest.mark.django_db
def test_public_portfolio_aggregated_endpoint(api_client):
    # Setup visible and hidden items
    Profile.objects.create(
        id=1,
        full_name="Sardorbek Ergashev",
        headline="Backend dasturchi",
        short_bio="Bio text",
        open_to_work=True,
    )
    Stat.objects.create(value="5+", label="Yil tajriba", order=0, visible=True)
    Stat.objects.create(value="99+", label="Yashirin", order=1, visible=False)

    Project.objects.create(
        title="TalantHub",
        description="Telegram e'lon platformasi",
        technologies="Python, Django",
        visible=True,
        order=0,
    )
    Project.objects.create(
        title="Secret Project",
        description="Hidden",
        technologies="Go",
        visible=False,
        order=1,
    )

    response = api_client.get("/api/portfolio/")
    assert response.status_code == 200
    data = response.data

    assert data["profile"]["full_name"] == "Sardorbek Ergashev"
    # Only visible stats
    assert len(data["stats"]) == 1
    assert data["stats"][0]["label"] == "Yil tajriba"

    # Only visible projects
    assert len(data["projects"]) == 1
    assert data["projects"][0]["title"] == "TalantHub"

@pytest.mark.django_db
def test_admin_portfolio_crud(api_client, admin_client):
    # Anonymous cannot access admin endpoints
    resp = api_client.get("/api/admin/projects/")
    assert resp.status_code == 401

    # Admin can list
    resp = admin_client.get("/api/admin/projects/")
    assert resp.status_code == 200

    # Admin can create
    create_resp = admin_client.post(
        "/api/admin/projects/",
        {
            "title": "Yangi Loyiha",
            "description": "Yangi loyiha tavsifi",
            "technologies": "Python, FastAPI",
            "visible": True,
            "order": 1,
        },
        format="json",
    )
    assert create_resp.status_code == 201
    project_id = create_resp.data["id"]

    # Admin can update
    patch_resp = admin_client.patch(
        f"/api/admin/projects/{project_id}/",
        {"title": "Yangilangan Loyiha"},
        format="json",
    )
    assert patch_resp.status_code == 200
    assert patch_resp.data["title"] == "Yangilangan Loyiha"

    # Admin can delete
    del_resp = admin_client.delete(f"/api/admin/projects/{project_id}/")
    assert del_resp.status_code == 204
