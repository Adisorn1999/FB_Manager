import { useEffect, useState } from 'react';
import api from '../api/axios';
import Swal from "sweetalert2";
export default function DataTable({ url, fields }) {
  const [list, setList] = useState([]);
  const [data, setData] = useState({});

  const fetchData = async () => {
    const res = await api.get(`/${url}`);
    setList(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {

  await api.post(`/${url}`, data);

  Swal.fire({
    icon: 'success',
    title: 'เพิ่มข้อมูลสำเร็จ',
    timer: 1200,
    showConfirmButton: false,
  });

  fetchData();

};

 const handleDelete = async (id) => {

  const result = await Swal.fire({
    title: 'ยืนยันการลบ?',
    text: 'ลบแล้วไม่สามารถกู้คืนได้',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  await api.delete(`/${url}/${id}`);

  Swal.fire({
    icon: 'success',
    title: 'ลบสำเร็จ',
    timer: 1200,
    showConfirmButton: false,
  });

  fetchData();

};

  return (
    <div>
      <h3>{url.toUpperCase()}</h3>

      {fields.map(f => (
        <input
          key={f}
          placeholder={f}
          onChange={(e) =>
            setData({ ...data, [f]: e.target.value })
          }
        />
      ))}

      <button onClick={handleAdd}>Add</button>

      <table border="1" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            {fields.map(f => <th key={f}>{f}</th>)}
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {list.map(item => (
            <tr key={item.id}>
              {fields.map(f => (
                <td key={f}>{item[f]}</td>
              ))}

              <td>
                <button onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}