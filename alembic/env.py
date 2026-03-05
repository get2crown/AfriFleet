from __future__ import with_statement
import sys
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
from alembic import context

# add project path so we can import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.models.database import Base
from backend.settings import settings

# Interpret the config file for Python logging.
# This line sets up loggers basically, but the default alembic.ini
# generated earlier omitted some logger sections.  Wrap in a
# try/except to avoid crashing when a key is missing.
try:
    fileConfig(context.config.config_file_name)
except Exception as e:
    # ignore logging configuration errors
    print(f"warning: unable to configure logging: {e}")

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.
    """
    url = settings.database_url
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.
    """
    configuration = context.config.get_section(context.config.config_ini_section)
    configuration['sqlalchemy.url'] = settings.database_url
    connectable = engine_from_config(
        configuration,
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
