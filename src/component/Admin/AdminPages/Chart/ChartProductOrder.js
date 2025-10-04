import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

import {
  GetCategoryList,
  GetOrderDetailList,
  GetProductByID
} from "../../../../services/ApiService";

const ChartProductOrder = () => {
  const [labels, setLabels] = useState([]);
  const [dataSet, setDataSet] = useState([]);
  const [colors, setColors] = useState([]);

  // Hàm tạo màu ngẫu nhiên dạng hex
  const getRandomColor = () =>
    "#" +
    Array.from({ length: 6 }, () =>
      "0123456789ABCDEF"[Math.floor(Math.random() * 16)]
    ).join("");

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // 1. Lấy danh sách category và order detail
        const categoryRes = await GetCategoryList();
        const orderDetailRes = await GetOrderDetailList();

        // 2. Chuẩn hoá dữ liệu category
        const categories = Array.isArray(categoryRes?.data?.data)
          ? categoryRes.data.data
          : Array.isArray(categoryRes?.data)
          ? categoryRes.data
          : Array.isArray(categoryRes)
          ? categoryRes
          : [];
        if (categories.length === 0) throw new Error("No categories found");
        console.log("Categories:", categories);

        // 3. Chuẩn hoá dữ liệu order detail
        const rawOrderDetails = Array.isArray(orderDetailRes?.data?.data)
          ? orderDetailRes.data.data
          : Array.isArray(orderDetailRes?.data)
          ? orderDetailRes.data
          : Array.isArray(orderDetailRes)
          ? orderDetailRes
          : [];
        if (rawOrderDetails.length === 0) throw new Error("No order details found");
        console.log("Order Details:", rawOrderDetails);

        // 4. Map categoryId sang index
        const categoryIndexMap = {};
        categories.forEach((c, idx) => {
          categoryIndexMap[c.categoryId] = idx;
        });

        const categoryNames = categories.map((c) => c.category_name);
        const categoryColors = categories.map(() => getRandomColor());
        const categoryCounts = new Array(categories.length).fill(0);

        // 5. Lấy danh sách productId duy nhất
        const productIds = [...new Set(rawOrderDetails.map((d) => d.productId))];
        const productList = await Promise.all(productIds.map((id) => GetProductByID(id)));

        // 6. Tạo map productId -> product (lưu data chuẩn)
        const productMap = {};
        productIds.forEach((id, i) => {
          const res = productList[i];
          const productData = res?.data?.data || res?.data || res; 
          productMap[id] = productData;
        });
        console.log("Product map:", productMap);

        // 7. Cộng quantity vào từng category
        rawOrderDetails.forEach((detail) => {
          const product = productMap[detail.productId];
          if (!product || !product.categoryId) return;
          const idx = categoryIndexMap[product.categoryId];
          if (idx !== undefined) {
            categoryCounts[idx] += detail.quantity || 0;
          }
        });
        console.log("Category counts:", categoryCounts);

        // 8. Set state cho chart
        setLabels(categoryNames);
        setColors(categoryColors);
        setDataSet(categoryCounts);
      } catch (error) {
        console.error("Error loading chart data:", error.message);
        setLabels([]);
        setDataSet([]);
        setColors([]);
      }
    };

    fetchChartData();
  }, []);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Quantity Ordered",
            data: dataSet,
            backgroundColor: colors,
          },
        ],
      }}
      options={{
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Total Orders per Category" },
        },
        responsive: true,
        maintainAspectRatio: false
      }}
    />
  );
};

export default ChartProductOrder;
