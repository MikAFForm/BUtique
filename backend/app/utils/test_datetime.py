import sys
from pathlib import Path
from datetime import datetime

# Ensure backend path when running from repo root
BACKEND_ROOT = Path(__file__).resolve().parents[2]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.utils import datetime as dt_utils  # noqa: E402


def test_parse_datetime_string_with_z_suffix():
    result = dt_utils.parse_datetime("2025-01-01T00:00:00Z")
    assert isinstance(result, datetime)
    assert result.year == 2025
    assert result.tzinfo is not None


def test_parse_datetime_passthrough_non_string():
    obj = {"raw": True}
    assert dt_utils.parse_datetime(obj) is obj
