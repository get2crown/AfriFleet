"""add vehicle_type column

Revision ID: 0002_add_vehicle_type
Revises: 0001_initial
Create Date: 2026-03-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0002_add_vehicle_type'
down_revision = '0001_initial'
branch_labels = None
depends_on = None


def upgrade():
    # add vehicle_type column to vehicles table
    with op.batch_alter_table('vehicles', schema=None) as batch_op:
        batch_op.add_column(sa.Column('vehicle_type', sa.String(), nullable=True))


def downgrade():
    with op.batch_alter_table('vehicles', schema=None) as batch_op:
        batch_op.drop_column('vehicle_type')
