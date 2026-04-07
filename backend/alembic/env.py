from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os, sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from database.connection import Base
from models import database  # importa tus modelos

config = context.config

# Lee DATABASE_URL desde variable de entorno
config.set_main_option("sqlalchemy.url", os.environ["DATABASE_URL"])

if config.config_file_name is not None:
    fileConfig(config.config_file_name)


def include_object(object, name, type_, reflected, compare_to):
    # ignorar tablas de PostGIS, Tiger y topology
    excluded_schemas = {"tiger", "tiger_data", "topology"}
    if hasattr(object, "schema") and object.schema in excluded_schemas:
        return False
    excluded_tables = {
        "spatial_ref_sys", "tabblock", "tabblock20", "faces", "edges",
        "addr", "addrfeat", "featnames", "tract", "bg", "zcta5", "state",
        "county", "place", "cousub", "layer", "topology", "pagc_rules",
        "pagc_gaz", "pagc_lex", "loader_variables", "loader_platform",
        "loader_lookuptables", "geocode_settings", "geocode_settings_default",
        "zip_lookup", "zip_lookup_all", "zip_lookup_base", "zip_state",
        "zip_state_loc", "state_lookup", "county_lookup", "countysub_lookup",
        "place_lookup", "street_type_lookup", "direction_lookup",
        "secondary_unit_lookup"
    }
    if type_ == "table" and name in excluded_tables:
        return False
    return True


target_metadata = Base.metadata


def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, 
                          target_metadata=target_metadata,
                          include_object=include_object 
                        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()