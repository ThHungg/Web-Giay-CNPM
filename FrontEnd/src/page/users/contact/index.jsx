import React, { useState } from "react";

const Contact = () => {
  const [issues, setIssues] = useState([
    { content: "Vấn đề thanh toán", date: "02-03-2025", status: "Đang xử lý" }
  ]);
  const [newIssue, setNewIssue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newIssue.trim()) return; 

    const currentDate = new Date().toLocaleDateString("vi-VN");

    setIssues([...issues, { content: newIssue, date: currentDate, status: "Đang xử lý" }]);
    setNewIssue("");
  };

  return (
    <div className="max-w-screen-xl mx-auto bg-white grid grid-rows-2 gap-6 mt-5 p-3">
      {/* Nhập vấn đề */}
      <div>
        <h1 className="text-center font-bold text-2xl">Liên hệ hỗ trợ</h1>
        <form className="flex flex-col mt-4" onSubmit={handleSubmit}>
          <label htmlFor="message" className="text-xl mb-2">Vấn đề cần hỗ trợ</label>
          <textarea
            id="message"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập nội dung cần hỗ trợ"
            value={newIssue}
            onChange={(e) => setNewIssue(e.target.value)}
          />
          <button type="submit" className="mt-3 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition">
            Gửi vấn đề
          </button>
        </form>
      </div>

      {/* Danh sách vấn đề đã gửi */}
      <div>
        <h1 className="text-center font-bold text-2xl">Các vấn đề đã gửi</h1>
        <div className="mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left bg-gray-100">
                <th className="px-4 py-3 w-1/3 text-2xl text-center">Vấn đề</th>
                <th className="px-4 py-3 w-1/3 text-2xl text-center">Ngày gửi</th>
                <th className="px-4 py-3 w-1/3 text-2xl text-center">Phản hồi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {issues.map((issue, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-center">{issue.content}</td>
                  <td className="px-4 py-3 text-center">{issue.date}</td>
                  <td className="px-4 py-3 text-center">{issue.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Contact;
