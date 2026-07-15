import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  initialData = null,
}) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Todo",
    category_id: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "Todo",
        category_id: initialData.category_id || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        status: "Todo",
        category_id: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{
              scale: 0.8,
              opacity: 0,
              y: 30,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              y: 30,
            }}
            transition={{
              duration: 0.25,
            }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b">

              <h2 className="text-2xl font-bold text-slate-800">
                {initialData ? "Edit Task" : "Tambah Task"}
              </h2>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <FaTimes size={22} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-5"
            >
              <div>
                <label className="block mb-2 font-semibold">
                  Judul
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">
                  Deskripsi
                </label>

                <textarea
                  rows="4"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">

                <div>
                  <label className="block mb-2 font-semibold">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">
                      In Progress
                    </option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Kategori
                  </label>

                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="">
                      Pilih Kategori
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}

                  </select>

                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  {initialData ? "Update Task" : "Simpan Task"}
                </button>

              </div>

            </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;