import shutil
import datetime
import os
from ..settings import settings


def backup_database() -> str:
    """Copy the sqlite database file to the backup directory with a timestamp.

    Returns the path of the created backup file.
    """
    # only support sqlite for now
    if settings.database_url.startswith('sqlite:///'):
        src = settings.database_url.replace('sqlite:///', '')
    else:
        raise RuntimeError('backup_database only supports sqlite')

    dest_dir = settings.backup_dir
    os.makedirs(dest_dir, exist_ok=True)
    now = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    dest = os.path.join(dest_dir, f'afritech_fleet_backup_{now}.db')
    shutil.copy(src, dest)
    return dest


if __name__ == '__main__':
    print('creating backup...')
    path = backup_database()
    print('backup saved to', path)
