import pytest
from app.services.users.create_user.create_user import execute
class MockResponse:
    def __init__(self, data):
        self.data = data


class MockTable:
    def __init__(self, table_name):
        self.table_name = table_name
        self.inserted_values = None

    def insert(self, values):
        self.inserted_values = values
        return self

    def execute(self):
        if self.table_name == "users":
            return MockResponse(
                [
                    {
                        "id": "user-1",
                        "name": self.inserted_values.get("name"),
                        "email": self.inserted_values.get("email"),
                        "created_at": "2024-01-01T00:00:00Z",
                        "updated_at": "2024-01-01T00:00:00Z",
                    }
                ]
            )
        if self.table_name == "passwords":
            return MockResponse(
                [
                    {
                        "user_id": self.inserted_values.get("user_id"),
                        "password": self.inserted_values.get("password"),
                    }
                ]
            )
        return MockResponse([])


class MockSupabase:
    def __init__(self):
        self.tables = {}

    def table(self, name):
        if name not in self.tables:
            self.tables[name] = MockTable(name)
        return self.tables[name]



# Success Case
def test_create_user_success(monkeypatch):
    mock = MockSupabase()

    # Patch supabase inside module under test
    monkeypatch.setattr(
        "app.services.users.create_user.create_user.supabase",
        mock
    )

    # Use a password that satisfies validation (length, special char, etc.)
    result = execute("MikeTest", "Miketest@bu.edu", "Password1!")

    assert result["name"] == "MikeTest"
    assert result["email"] == "Miketest@bu.edu"

    # Check inserted values
    users_table = mock.tables["users"]
    passwords_table = mock.tables["passwords"]

    assert users_table.inserted_values["name"] == "MikeTest"
    assert users_table.inserted_values["email"] == "Miketest@bu.edu"

    assert passwords_table.inserted_values["user_id"] == "user-1"
    assert passwords_table.inserted_values["password"] == "Password1!"

    assert "created_at" in result
    assert "updated_at" in result


# Email Failure case

def test_invalid_email(monkeypatch):
    mock = MockSupabase()
    monkeypatch.setattr(
        "app.services.users.create_user.create_user.supabase",
        mock
    )

    with pytest.raises(ValueError) as exc:
        execute("Name", "notbu@gmail.com", "Password123!")

    assert "Email must end with @bu.edu" in str(exc.value)


# Password Failure cases

def test_password_too_short(monkeypatch):
    mock = MockSupabase()
    monkeypatch.setattr(
        "app.services.users.create_user.create_user.supabase",
        mock
    )

    with pytest.raises(ValueError) as exc:
        execute("Name", "name@bu.edu", "Aa1!")
    assert "at least 8 characters" in str(exc.value)


def test_password_missing_upper(monkeypatch):
    mock = MockSupabase()
    monkeypatch.setattr(
        "app.services.users.create_user.create_user.supabase",
        mock
    )

    with pytest.raises(ValueError) as exc:
        execute("Name", "name@bu.edu", "password123!")
    assert "uppercase" in str(exc.value)


def test_password_missing_lower(monkeypatch):
    mock = MockSupabase()
    monkeypatch.setattr(
        "app.services.users.create_user.create_user.supabase",
        mock
    )

    with pytest.raises(ValueError) as exc:
        execute("Name", "name@bu.edu", "PASSWORD123!")
    assert "lowercase" in str(exc.value)


def test_password_missing_number(monkeypatch):
    mock = MockSupabase()
    monkeypatch.setattr(
        "app.services.users.create_user.create_user.supabase",
        mock
    )

    with pytest.raises(ValueError) as exc:
        execute("Name", "name@bu.edu", "Password!!!")
    assert "number" in str(exc.value)


def test_password_missing_special(monkeypatch):
    mock = MockSupabase()
    monkeypatch.setattr(
        "app.services.users.create_user.create_user.supabase",
        mock
    )

    with pytest.raises(ValueError) as exc:
        execute("Name", "name@bu.edu", "Password123")
    assert "special character" in str(exc.value)
