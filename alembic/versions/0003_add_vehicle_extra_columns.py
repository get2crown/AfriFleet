"""add extra vehicle columns

Revision ID: 0003_add_vehicle_extra_columns
Revises: 0002_add_vehicle_type
Create Date: 2026-03-01 01:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0003_add_vehicle_extra_columns'
down_revision = '0002_add_vehicle_type'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('vehicles', schema=None) as batch_op:
        batch_op.add_column(sa.Column('current_mileage', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('status', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('notes', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('insurance_expiry', sa.Date(), nullable=True))
        batch_op.add_column(sa.Column('license_expiry', sa.Date(), nullable=True))
        batch_op.add_column(sa.Column('created_at', sa.Date(), nullable=True))


def downgrade():
    with op.batch_alter_table('vehicles', schema=None) as batch_op:
        batch_op.drop_column('created_at')
        batch_op.drop_column('license_expiry')
        batch_op.drop_column('insurance_expiry')
        batch_op.drop_column('notes')
        batch_op.drop_column('status')
        batch_op.drop_column('current_mileage')
