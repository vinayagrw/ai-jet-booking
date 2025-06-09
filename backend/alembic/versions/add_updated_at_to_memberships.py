"""add updated_at to memberships

Revision ID: add_updated_at_to_memberships
Revises: 
Create Date: 2024-06-08 20:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_updated_at_to_memberships'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('memberships', sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()))

def downgrade():
    op.drop_column('memberships', 'updated_at') 