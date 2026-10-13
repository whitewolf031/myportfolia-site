import pytest
from apps.portfolio.models import Project

@pytest.mark.django_db
def test_reorder_projects(admin_client):
    p1 = Project.objects.create(title="P1", description="D1", technologies="T1", order=0)
    p2 = Project.objects.create(title="P2", description="D2", technologies="T2", order=1)
    p3 = Project.objects.create(title="P3", description="D3", technologies="T3", order=2)

    # Reorder to [p3, p1, p2]
    response = admin_client.patch(
        "/api/admin/projects/reorder/",
        {"ids": [p3.id, p1.id, p2.id]},
        format="json",
    )
    assert response.status_code == 200

    p1.refresh_from_db()
    p2.refresh_from_db()
    p3.refresh_from_db()

    assert p3.order == 0
    assert p1.order == 1
    assert p2.order == 2
