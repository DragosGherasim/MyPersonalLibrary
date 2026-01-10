import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_AUTHORS } from "../graphql/queries";
import { GET_BOOK_DETAILS } from "../graphql/queries"; // keep your existing query name/path
import { UPDATE_BOOK, DELETE_BOOK } from "../graphql/mutations";

function BookDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const bookId = Number(id);

  const { data, loading, error, refetch } = useQuery(GET_BOOK_DETAILS, {
    variables: { id: bookId },
    fetchPolicy: "network-only",
  });

  const { data: authorsData } = useQuery(GET_AUTHORS, {
    fetchPolicy: "cache-first",
  });

  const [updateBook, { loading: saving }] = useMutation(UPDATE_BOOK);
  const [deleteBook, { loading: deleting }] = useMutation(DELETE_BOOK);

  const book = useMemo(() => {
    // Adjust this line if your GET_BOOK_DETAILS shape differs
    return data?.book ?? data?.bookById ?? data?.node ?? null;
  }, [data]);

  const authors = authorsData?.authors ?? [];

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    title: "",
    year: "",
    description: "",
    authorId: "",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!book) return;
    setForm({
      title: book.title ?? "",
      year: String(book.year ?? ""),
      description: book.description ?? "",
      authorId: String(book.authorId ?? book.author?.id ?? ""),
    });
  }, [book]);

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ padding: 24 }}>Error: {error.message}</div>;
  if (!book) return <div style={{ padding: 24 }}>Book not found.</div>;

  const onChange = (key) => (e) => {
    setFormError("");
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  async function onSave() {
    setFormError("");

    const yearInt = Number(form.year);
    const authorIdInt = Number(form.authorId);

    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!Number.isInteger(yearInt)) {
      setFormError("Year must be a number.");
      return;
    }
    if (yearInt > 2026) {
      setFormError("Year cannot be greater than 2026.");
      return;
    }
    if (!Number.isInteger(authorIdInt) || authorIdInt <= 0) {
      setFormError("Please select an author.");
      return;
    }

    const res = await updateBook({
      variables: {
        id: bookId,
        title: form.title.trim(),
        year: yearInt,
        description: form.description,
        authorId: authorIdInt,
      },
    });

    const errors = res?.data?.updateBook?.errors;
    if (errors?.length) {
      const first = errors[0];
      setFormError(first.message ?? `Error: ${first.__typename}`);
      return;
    }

    setIsEditing(false);
    await refetch(); // ✅ ensures author loads correctly
  }

  async function onDelete() {
    setFormError("");
    const confirmDelete = window.confirm("Delete this book?");
    if (!confirmDelete) return;

    const res = await deleteBook({ variables: { id: bookId } });
    const payload = res?.data?.deleteBook;

    if (payload?.errors?.length) {
      const first = payload.errors[0];
      setFormError(first.message ?? `Error: ${first.__typename}`);
      return;
    }

    if (payload?.success) {
      navigate("/library"); // adjust if your library route differs
    } else {
      setFormError("Delete failed.");
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>{book.title}</h1>
          <div style={{ color: "#666", marginTop: 6 }}>
            by <b>{book.author?.name ?? "Unknown"}</b> | {book.year}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>Edit</button>
          ) : (
            <>
              <button onClick={onSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setIsEditing(false)} disabled={saving}>
                Cancel
              </button>
            </>
          )}

          <button onClick={onDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <hr style={{ margin: "24px 0" }} />

      {formError ? (
        <div style={{ background: "#ffe2e2", border: "1px solid #ffb3b3", padding: 12, borderRadius: 8, marginBottom: 16 }}>
          {formError}
        </div>
      ) : null}

      <h2>About this Book</h2>

      {!isEditing ? (
        <p style={{ lineHeight: 1.6 }}>
          {book.description?.trim() ? book.description : <i>No description.</i>}
        </p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          <label>
            Title
            <input value={form.title} onChange={onChange("title")} style={{ width: "100%", padding: 8, marginTop: 6 }} />
          </label>

          <label>
            Year
            <input value={form.year} onChange={onChange("year")} style={{ width: "100%", padding: 8, marginTop: 6 }} />
          </label>

          <label>
            Author
            <select value={form.authorId} onChange={onChange("authorId")} style={{ width: "100%", padding: 8, marginTop: 6 }}>
              <option value="">-- select author --</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Description
            <textarea
              value={form.description}
              onChange={onChange("description")}
              rows={6}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>
        </div>
      )}
    </div>
  );
}
export default BookDetailsPage;
