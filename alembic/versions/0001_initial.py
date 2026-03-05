"""initial

Revision ID: 0001_initial
Revises: 
Create Date: 2026-02-28 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # NOTE: this file was generated manually to illustrate structure; you
    # should run `alembic revision --autogenerate` to create real migrations
    pass


def downgrade():
    pass
