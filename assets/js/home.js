/* =============================================================
   STYLEMIX — assets/js/home.js
   Homepage logic: outfits data, filter, slider, hero reveal
   ============================================================= */

'use strict';

/* ── Outfits Data ─────────────────────────────────────────── */
const OUTFITS = [
  {
    "id": "photo-black-trousers",
    "title": "Áo thun đen và quần vải đen",
    "name": "Áo thun đen và quần vải đen",
    "occasions": [
      "school",
      "work",
      "social"
    ],
    "image": "./assets/photos/black-trousers.jpg",
    "img": "./assets/photos/black-trousers.jpg",
    "imageSource": "https://www.pinterest.com/pin/661325526579466558/",
    "sourceUrl": "https://www.pinterest.com/pin/661325526579466558/",
    "fullBodyReviewed": true,
    "requiredSlots": [
      {
        "id": "top",
        "acceptedItemIds": [
          "tee-black"
        ],
        "substituteItemIds": []
      },
      {
        "id": "bottom",
        "acceptedItemIds": [
          "trousers-black"
        ],
        "substituteItemIds": []
      }
    ],
    "optionalItems": [],
    "instructions": [
      "Ảnh cho thấy toàn bộ outfit. Đối chiếu loại và màu từng món với tủ đồ; không cần mua đúng sản phẩm hoặc thương hiệu trong ảnh.",
      "Đi học: chỉ áp dụng vào ngày trường cho mặc tự do; ưu tiên quy định đồng phục của trường.",
      "Đi làm: kiểm tra quy định công sở; áo thun, jeans hoặc sneaker chỉ phù hợp nơi cho ăn mặc thoải mái.",
      "Giày và phụ kiện trong ảnh chỉ giúp hình dung tổng thể; không phải điều kiện lọc hoặc món bắt buộc trong ứng dụng."
    ],
    "editorialOrder": 0,
    "tag": "Phối đồ cơ bản",
    "color": [
      "black"
    ],
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo thun đen",
      "Quần vải đen"
    ]
  },
  {
    "id": "photo-black-jeans-hoodie",
    "title": "Hoodie đen và jeans đen",
    "name": "Hoodie đen và jeans đen",
    "occasions": [
      "school",
      "social"
    ],
    "image": "./assets/photos/black-jeans-hoodie.jpg",
    "img": "./assets/photos/black-jeans-hoodie.jpg",
    "imageSource": "https://www.pinterest.com/pin/1131036893952756050/",
    "sourceUrl": "https://www.pinterest.com/pin/1131036893952756050/",
    "fullBodyReviewed": true,
    "requiredSlots": [
      {
        "id": "top",
        "acceptedItemIds": [
          "tee-white"
        ],
        "substituteItemIds": [
          "tee-black"
        ]
      },
      {
        "id": "bottom",
        "acceptedItemIds": [
          "jeans-black"
        ],
        "substituteItemIds": []
      },
      {
        "id": "outerwear",
        "acceptedItemIds": [
          "hoodie-black"
        ],
        "substituteItemIds": []
      }
    ],
    "optionalItems": [],
    "instructions": [
      "Ảnh cho thấy toàn bộ outfit. Đối chiếu loại và màu từng món với tủ đồ; không cần mua đúng sản phẩm hoặc thương hiệu trong ảnh.",
      "Đi học: chỉ áp dụng vào ngày trường cho mặc tự do; ưu tiên quy định đồng phục của trường.",
      "Giày và phụ kiện trong ảnh chỉ giúp hình dung tổng thể; không phải điều kiện lọc hoặc món bắt buộc trong ứng dụng."
    ],
    "editorialOrder": 1,
    "tag": "Phối đồ cơ bản",
    "color": [
      "white",
      "black"
    ],
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo thun trắng",
      "Quần jeans đen",
      "Áo khoác hoodie đen"
    ]
  },
  {
    "id": "photo-blue-jeans-green-tee",
    "title": "Áo thun xanh lá và jeans xanh",
    "name": "Áo thun xanh lá và jeans xanh",
    "occasions": [
      "school",
      "social"
    ],
    "image": "./assets/photos/blue-jeans-green-tee.jpg",
    "img": "./assets/photos/blue-jeans-green-tee.jpg",
    "imageSource": "https://www.pinterest.com/pin/915497430526409091/",
    "sourceUrl": "https://www.pinterest.com/pin/915497430526409091/",
    "fullBodyReviewed": true,
    "requiredSlots": [
      {
        "id": "top",
        "acceptedItemIds": [
          "tee-green"
        ],
        "substituteItemIds": []
      },
      {
        "id": "bottom",
        "acceptedItemIds": [
          "jeans-blue"
        ],
        "substituteItemIds": [
          "jeans-black"
        ]
      }
    ],
    "optionalItems": [],
    "instructions": [
      "Ảnh cho thấy toàn bộ outfit. Đối chiếu loại và màu từng món với tủ đồ; không cần mua đúng sản phẩm hoặc thương hiệu trong ảnh.",
      "Đi học: chỉ áp dụng vào ngày trường cho mặc tự do; ưu tiên quy định đồng phục của trường.",
      "Giày và phụ kiện trong ảnh chỉ giúp hình dung tổng thể; không phải điều kiện lọc hoặc món bắt buộc trong ứng dụng."
    ],
    "editorialOrder": 2,
    "tag": "Phối đồ cơ bản",
    "color": [
      "green",
      "blue"
    ],
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo thun xanh lá",
      "Quần jeans xanh biển"
    ]
  },
  {
    "id": "photo-blue-jeans-white-shirt",
    "title": "Sơ mi trắng và jeans xanh",
    "name": "Sơ mi trắng và jeans xanh",
    "occasions": [
      "school",
      "work",
      "social"
    ],
    "image": "./assets/photos/blue-jeans-white-shirt.jpg",
    "img": "./assets/photos/blue-jeans-white-shirt.jpg",
    "imageSource": "https://www.pinterest.com/pin/1084241679075528265/",
    "sourceUrl": "https://www.pinterest.com/pin/1084241679075528265/",
    "fullBodyReviewed": true,
    "requiredSlots": [
      {
        "id": "top",
        "acceptedItemIds": [
          "shirt-white"
        ],
        "substituteItemIds": []
      },
      {
        "id": "bottom",
        "acceptedItemIds": [
          "jeans-blue"
        ],
        "substituteItemIds": [
          "jeans-black"
        ]
      }
    ],
    "optionalItems": [],
    "instructions": [
      "Ảnh cho thấy toàn bộ outfit. Đối chiếu loại và màu từng món với tủ đồ; không cần mua đúng sản phẩm hoặc thương hiệu trong ảnh.",
      "Sơ vin gọn nếu muốn chỉn chu; có thể thả áo khi phù hợp với phom quần và hoàn cảnh.",
      "Đi học: chỉ áp dụng vào ngày trường cho mặc tự do; ưu tiên quy định đồng phục của trường.",
      "Đi làm: kiểm tra quy định công sở; áo thun, jeans hoặc sneaker chỉ phù hợp nơi cho ăn mặc thoải mái.",
      "Giày và phụ kiện trong ảnh chỉ giúp hình dung tổng thể; không phải điều kiện lọc hoặc món bắt buộc trong ứng dụng."
    ],
    "editorialOrder": 3,
    "tag": "Phối đồ cơ bản",
    "color": [
      "white",
      "blue"
    ],
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo sơ mi trắng",
      "Quần jeans xanh biển"
    ]
  },
  {
    "id": "photo-beige-trousers-brown-jacket",
    "title": "Áo khoác nâu và quần vải be",
    "name": "Áo khoác nâu và quần vải be",
    "occasions": [
      "school",
      "work",
      "social"
    ],
    "image": "./assets/photos/beige-trousers-brown-jacket.jpg",
    "img": "./assets/photos/beige-trousers-brown-jacket.jpg",
    "imageSource": "https://www.pinterest.com/pin/1130122100274089024/",
    "sourceUrl": "https://www.pinterest.com/pin/1130122100274089024/",
    "fullBodyReviewed": true,
    "requiredSlots": [
      {
        "id": "top",
        "acceptedItemIds": [
          "shirt-black"
        ],
        "substituteItemIds": []
      },
      {
        "id": "bottom",
        "acceptedItemIds": [
          "trousers-beige"
        ],
        "substituteItemIds": []
      },
      {
        "id": "outerwear",
        "acceptedItemIds": [
          "jacket-brown"
        ],
        "substituteItemIds": []
      }
    ],
    "optionalItems": [],
    "instructions": [
      "Ảnh cho thấy toàn bộ outfit. Đối chiếu loại và màu từng món với tủ đồ; không cần mua đúng sản phẩm hoặc thương hiệu trong ảnh.",
      "Sơ vin gọn nếu muốn chỉn chu; có thể thả áo khi phù hợp với phom quần và hoàn cảnh.",
      "Đi học: chỉ áp dụng vào ngày trường cho mặc tự do; ưu tiên quy định đồng phục của trường.",
      "Đi làm: kiểm tra quy định công sở; áo thun, jeans hoặc sneaker chỉ phù hợp nơi cho ăn mặc thoải mái.",
      "Giày và phụ kiện trong ảnh chỉ giúp hình dung tổng thể; không phải điều kiện lọc hoặc món bắt buộc trong ứng dụng."
    ],
    "editorialOrder": 4,
    "tag": "Phối đồ cơ bản",
    "color": [
      "black",
      "beige",
      "brown"
    ],
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo sơ mi đen",
      "Quần vải be",
      "Áo khoác nâu"
    ]
  },
  {
    "id": "photo-beige-trousers-vest",
    "title": "Sơ mi trắng, gile be và quần be",
    "name": "Sơ mi trắng, gile be và quần be",
    "occasions": [
      "school",
      "work",
      "presentation"
    ],
    "image": "./assets/photos/beige-trousers-vest.jpg",
    "img": "./assets/photos/beige-trousers-vest.jpg",
    "imageSource": "https://www.pinterest.com/pin/1089167491167358065/",
    "sourceUrl": "https://www.pinterest.com/pin/1089167491167358065/",
    "fullBodyReviewed": true,
    "requiredSlots": [
      {
        "id": "top",
        "acceptedItemIds": [
          "shirt-white"
        ],
        "substituteItemIds": []
      },
      {
        "id": "bottom",
        "acceptedItemIds": [
          "trousers-beige"
        ],
        "substituteItemIds": []
      },
      {
        "id": "outerwear",
        "acceptedItemIds": [
          "vest-beige"
        ],
        "substituteItemIds": []
      }
    ],
    "optionalItems": [],
    "instructions": [
      "Ảnh cho thấy toàn bộ outfit. Đối chiếu loại và màu từng món với tủ đồ; không cần mua đúng sản phẩm hoặc thương hiệu trong ảnh.",
      "Sơ vin gọn nếu muốn chỉn chu; có thể thả áo khi phù hợp với phom quần và hoàn cảnh.",
      "Đi học: chỉ áp dụng vào ngày trường cho mặc tự do; ưu tiên quy định đồng phục của trường.",
      "Đi làm: kiểm tra quy định công sở; áo thun, jeans hoặc sneaker chỉ phù hợp nơi cho ăn mặc thoải mái.",
      "Thuyết trình hoặc phỏng vấn: ưu tiên trang phục phẳng, vừa vặn và phù hợp mức trang trọng của buổi gặp.",
      "Giày và phụ kiện trong ảnh chỉ giúp hình dung tổng thể; không phải điều kiện lọc hoặc món bắt buộc trong ứng dụng."
    ],
    "editorialOrder": 5,
    "tag": "Phối đồ cơ bản",
    "color": [
      "white",
      "beige"
    ],
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo sơ mi trắng",
      "Quần vải be",
      "Áo gile be"
    ]
  },
  {
    "id": "photo-gray-trousers-black-tee",
    "title": "Áo thun đen và quần vải xám",
    "name": "Áo thun đen và quần vải xám",
    "occasions": [
      "school",
      "work",
      "social"
    ],
    "image": "./assets/photos/gray-trousers-black-tee.jpg",
    "img": "./assets/photos/gray-trousers-black-tee.jpg",
    "imageSource": "https://www.pinterest.com/pin/706642997874745107/",
    "sourceUrl": "https://www.pinterest.com/pin/706642997874745107/",
    "fullBodyReviewed": true,
    "requiredSlots": [
      {
        "id": "top",
        "acceptedItemIds": [
          "tee-black"
        ],
        "substituteItemIds": []
      },
      {
        "id": "bottom",
        "acceptedItemIds": [
          "trousers-gray"
        ],
        "substituteItemIds": []
      }
    ],
    "optionalItems": [],
    "instructions": [
      "Ảnh cho thấy toàn bộ outfit. Đối chiếu loại và màu từng món với tủ đồ; không cần mua đúng sản phẩm hoặc thương hiệu trong ảnh.",
      "Đi học: chỉ áp dụng vào ngày trường cho mặc tự do; ưu tiên quy định đồng phục của trường.",
      "Đi làm: kiểm tra quy định công sở; áo thun, jeans hoặc sneaker chỉ phù hợp nơi cho ăn mặc thoải mái.",
      "Giày và phụ kiện trong ảnh chỉ giúp hình dung tổng thể; không phải điều kiện lọc hoặc món bắt buộc trong ứng dụng."
    ],
    "editorialOrder": 6,
    "tag": "Phối đồ cơ bản",
    "color": [
      "black",
      "gray"
    ],
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo thun đen",
      "Quần vải xám"
    ]
  },
  {
    "id": "photo-gray-trousers-blazer",
    "title": "Sơ mi khoác xám và quần vải xám",
    "name": "Sơ mi khoác xám và quần vải xám",
    "occasions": [
      "work",
      "presentation",
      "social"
    ],
    "image": "./assets/photos/gray-trousers-blazer.jpg",
    "img": "./assets/photos/gray-trousers-blazer.jpg",
    "imageSource": "https://www.pinterest.com/pin/1125055550701020154/",
    "sourceUrl": "https://www.pinterest.com/pin/1125055550701020154/",
    "fullBodyReviewed": true,
    "requiredSlots": [
      {
        "id": "top",
        "acceptedItemIds": [
          "inner-white"
        ],
        "substituteItemIds": []
      },
      {
        "id": "bottom",
        "acceptedItemIds": [
          "trousers-gray"
        ],
        "substituteItemIds": []
      },
      {
        "id": "outerwear",
        "acceptedItemIds": [
          "overshirt-gray"
        ],
        "substituteItemIds": []
      }
    ],
    "optionalItems": [],
    "instructions": [
      "Ảnh cho thấy toàn bộ outfit. Đối chiếu loại và màu từng món với tủ đồ; không cần mua đúng sản phẩm hoặc thương hiệu trong ảnh.",
      "Đi làm: kiểm tra quy định công sở; áo thun, jeans hoặc sneaker chỉ phù hợp nơi cho ăn mặc thoải mái.",
      "Thuyết trình hoặc phỏng vấn: ưu tiên trang phục phẳng, vừa vặn và phù hợp mức trang trọng của buổi gặp.",
      "Giày và phụ kiện trong ảnh chỉ giúp hình dung tổng thể; không phải điều kiện lọc hoặc món bắt buộc trong ứng dụng."
    ],
    "editorialOrder": 7,
    "tag": "Phối đồ cơ bản",
    "color": [
      "white",
      "gray"
    ],
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo mặc trong trắng",
      "Quần vải xám",
      "Áo sơ mi khoác xám"
    ]
  },
  {
    "id": "photo-white-tee-blue-jeans",
    "title": "Áo thun trắng và jeans xanh",
    "name": "Áo thun trắng và jeans xanh",
    "occasions": [
      "school",
      "social"
    ],
    "image": "./assets/photos/white-tee-blue-jeans.jpg",
    "img": "./assets/photos/white-tee-blue-jeans.jpg",
    "imageSource": "https://www.pinterest.com/pin/1135118281119740169/",
    "sourceUrl": "https://www.pinterest.com/pin/1135118281119740169/",
    "fullBodyReviewed": true,
    "requiredSlots": [
      {
        "id": "top",
        "acceptedItemIds": [
          "tee-white"
        ],
        "substituteItemIds": [
          "tee-black"
        ]
      },
      {
        "id": "bottom",
        "acceptedItemIds": [
          "jeans-blue"
        ],
        "substituteItemIds": [
          "jeans-black"
        ]
      }
    ],
    "optionalItems": [],
    "instructions": [
      "Ảnh cho thấy toàn bộ outfit. Đối chiếu loại và màu từng món với tủ đồ; không cần mua đúng sản phẩm hoặc thương hiệu trong ảnh.",
      "Đi học: chỉ áp dụng vào ngày trường cho mặc tự do; ưu tiên quy định đồng phục của trường.",
      "Giày và phụ kiện trong ảnh chỉ giúp hình dung tổng thể; không phải điều kiện lọc hoặc món bắt buộc trong ứng dụng."
    ],
    "editorialOrder": 8,
    "tag": "Phối đồ cơ bản",
    "color": [
      "white",
      "blue"
    ],
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo thun trắng",
      "Quần jeans xanh biển"
    ]
  },
  {
    "id": "photo-white-shirt-black-trousers",
    "title": "Sơ mi trắng và quần vải đen",
    "name": "Sơ mi trắng và quần vải đen",
    "occasions": [
      "school",
      "work",
      "presentation"
    ],
    "image": "./assets/photos/white-shirt-black-trousers.jpg",
    "img": "./assets/photos/white-shirt-black-trousers.jpg",
    "imageSource": "https://www.pinterest.com/pin/359513982770774871/",
    "sourceUrl": "https://www.pinterest.com/pin/359513982770774871/",
    "fullBodyReviewed": true,
    "requiredSlots": [
      {
        "id": "top",
        "acceptedItemIds": [
          "shirt-white"
        ],
        "substituteItemIds": []
      },
      {
        "id": "bottom",
        "acceptedItemIds": [
          "trousers-black"
        ],
        "substituteItemIds": []
      }
    ],
    "optionalItems": [],
    "instructions": [
      "Ảnh cho thấy toàn bộ outfit. Đối chiếu loại và màu từng món với tủ đồ; không cần mua đúng sản phẩm hoặc thương hiệu trong ảnh.",
      "Sơ vin gọn nếu muốn chỉn chu; có thể thả áo khi phù hợp với phom quần và hoàn cảnh.",
      "Đi học: chỉ áp dụng vào ngày trường cho mặc tự do; ưu tiên quy định đồng phục của trường.",
      "Đi làm: kiểm tra quy định công sở; áo thun, jeans hoặc sneaker chỉ phù hợp nơi cho ăn mặc thoải mái.",
      "Thuyết trình hoặc phỏng vấn: ưu tiên trang phục phẳng, vừa vặn và phù hợp mức trang trọng của buổi gặp.",
      "Giày và phụ kiện trong ảnh chỉ giúp hình dung tổng thể; không phải điều kiện lọc hoặc món bắt buộc trong ứng dụng."
    ],
    "editorialOrder": 9,
    "tag": "Phối đồ cơ bản",
    "color": [
      "white",
      "black"
    ],
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo sơ mi trắng",
      "Quần vải đen"
    ]
  },
  {
    "id": "photo-white-hoodie-blue-jeans",
    "title": "Hoodie trắng và jeans xanh",
    "name": "Hoodie trắng và jeans xanh",
    "occasions": [
      "school",
      "social"
    ],
    "image": "./assets/photos/white-hoodie-blue-jeans.jpg",
    "img": "./assets/photos/white-hoodie-blue-jeans.jpg",
    "imageSource": "https://www.pinterest.com/pin/4593812441569827904/",
    "sourceUrl": "https://www.pinterest.com/pin/4593812441569827904/",
    "fullBodyReviewed": true,
    "requiredSlots": [
      {
        "id": "outerwear",
        "acceptedItemIds": [
          "hoodie-white"
        ],
        "substituteItemIds": []
      },
      {
        "id": "bottom",
        "acceptedItemIds": [
          "jeans-blue"
        ],
        "substituteItemIds": [
          "jeans-black"
        ]
      }
    ],
    "optionalItems": [],
    "instructions": [
      "Ảnh cho thấy toàn bộ outfit. Đối chiếu loại và màu từng món với tủ đồ; không cần mua đúng sản phẩm hoặc thương hiệu trong ảnh.",
      "Đi học: chỉ áp dụng vào ngày trường cho mặc tự do; ưu tiên quy định đồng phục của trường.",
      "Giày và phụ kiện trong ảnh chỉ giúp hình dung tổng thể; không phải điều kiện lọc hoặc món bắt buộc trong ứng dụng."
    ],
    "editorialOrder": 10,
    "tag": "Phối đồ cơ bản",
    "color": [
      "white",
      "blue"
    ],
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo hoodie trắng",
      "Quần jeans xanh biển"
    ]
  },
  {
    "id": "photo-blue-denim-jacket",
    "title": "Áo khoác jeans xanh cùng áo thun trắng",
    "name": "Áo khoác jeans xanh cùng áo thun trắng",
    "occasions": [
      "school",
      "social"
    ],
    "image": "./assets/photos/blue-denim-jacket.jpg",
    "img": "./assets/photos/blue-denim-jacket.jpg",
    "imageSource": "https://www.pinterest.com/pin/1084171310331580352/",
    "sourceUrl": "https://www.pinterest.com/pin/1084171310331580352/",
    "fullBodyReviewed": true,
    "requiredSlots": [
      {
        "id": "top",
        "acceptedItemIds": [
          "tee-white"
        ],
        "substituteItemIds": [
          "tee-black"
        ]
      },
      {
        "id": "bottom",
        "acceptedItemIds": [
          "jeans-blue"
        ],
        "substituteItemIds": [
          "jeans-black"
        ]
      },
      {
        "id": "outerwear",
        "acceptedItemIds": [
          "denim-jacket-blue"
        ],
        "substituteItemIds": []
      }
    ],
    "optionalItems": [],
    "instructions": [
      "Ảnh cho thấy toàn bộ outfit. Đối chiếu loại và màu từng món với tủ đồ; không cần mua đúng sản phẩm hoặc thương hiệu trong ảnh.",
      "Đi học: chỉ áp dụng vào ngày trường cho mặc tự do; ưu tiên quy định đồng phục của trường.",
      "Giày và phụ kiện trong ảnh chỉ giúp hình dung tổng thể; không phải điều kiện lọc hoặc món bắt buộc trong ứng dụng."
    ],
    "editorialOrder": 11,
    "tag": "Phối đồ cơ bản",
    "color": [
      "white",
      "blue"
    ],
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo thun trắng",
      "Quần jeans xanh biển",
      "Áo khoác jeans xanh"
    ]
  }
];

/* ── Style Modal Data ─────────────────────────────────────── */
window.STYLE_DATA = {
  "streetwear": {
    "title": "Hoodie đen và jeans đen",
    "tag": "Phối đồ cơ bản",
    "img": "./assets/photos/black-jeans-hoodie.jpg",
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo thun trắng",
      "Quần jeans đen",
      "Áo khoác hoodie đen"
    ],
    "sourceUrl": "https://www.pinterest.com/pin/1131036893952756050/"
  },
  "minimal": {
    "title": "Sơ mi trắng và quần vải đen",
    "tag": "Phối đồ cơ bản",
    "img": "./assets/photos/white-shirt-black-trousers.jpg",
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo sơ mi trắng",
      "Quần vải đen"
    ],
    "sourceUrl": "https://www.pinterest.com/pin/359513982770774871/"
  },
  "vintage": {
    "title": "Áo khoác nâu và quần vải be",
    "tag": "Phối đồ cơ bản",
    "img": "./assets/photos/beige-trousers-brown-jacket.jpg",
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo sơ mi đen",
      "Quần vải be",
      "Áo khoác nâu"
    ],
    "sourceUrl": "https://www.pinterest.com/pin/1130122100274089024/"
  },
  "sporty": {
    "title": "Hoodie trắng và jeans xanh",
    "tag": "Phối đồ cơ bản",
    "img": "./assets/photos/white-hoodie-blue-jeans.jpg",
    "desc": "Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.",
    "items": [
      "Áo hoodie trắng",
      "Quần jeans xanh biển"
    ],
    "sourceUrl": "https://www.pinterest.com/pin/4593812441569827904/"
  }
};

/* ── Render & Filter ──────────────────────────────────────── */
let currentFilter = 'all';

function renderOutfits(data) {
    const grid = document.getElementById('outfitGrid');
    if (!grid) return;
    grid.innerHTML = '';
    data.forEach((o, i) => {
        const card = window.createOutfitCard(o, (i % 4) * 0.07);
        grid.appendChild(card);
    });
    window.initScrollReveal?.();
    window.bindCursorHover?.();
}

window.filterColor = function (el, color) {
    document.querySelectorAll('.color-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    currentFilter = color;
    applyHomeFilters();
};

function applyHomeFilters() {
    const list=window.CatalogFilter.filterItems(OUTFITS,{color:currentFilter,query:document.getElementById('homeSearch')?.value});
    renderOutfits(list);
    if(!list.length){const p=document.createElement('p');p.className='catalog-message';p.textContent='Không có outfit tham khảo với điều kiện này. Đổi màu hoặc từ khóa để thử lại.';document.getElementById('outfitGrid').append(p);}
}
document.getElementById('homeSearch')?.addEventListener('input',applyHomeFilters);
function buildHomeColorPills() {
    const wrap=document.getElementById('homeColorPills');
    if(!wrap) return;
    const names={all:'Tất cả',black:'Đen',white:'Trắng',gray:'Xám',blue:'Xanh dương',beige:'Be',brown:'Nâu',green:'Xanh lá'};
    const hex={black:'#303034',white:'#fff',gray:'#96969c',blue:'#6484a1',beige:'#c4ae8b',brown:'#6d4d35',green:'#245547'};
    const values=['all',...new Set(OUTFITS.flatMap(o=>[o.color].flat()))];
    wrap.replaceChildren(...values.map(color=>{
        const button=document.createElement('button'),dot=document.createElement('span');
        button.type='button';button.className='color-pill'+(color===currentFilter?' active':'');
        dot.className='color-dot';dot.style.background=hex[color]||'transparent';
        button.append(dot,document.createTextNode(names[color]||color));
        button.addEventListener('click',()=>window.filterColor(button,color));return button;
    }));
}
buildHomeColorPills();


/* ── Trending Slider ──────────────────────────────────────── */
(function initSlider() {
    const track = document.getElementById('trendingTrack');
    const dotsWrap = document.getElementById('sliderDots');
    if (!track || !dotsWrap) return;

    const TOTAL = track.querySelectorAll('.trending__slide').length;
    let idx = 0,
        timer;

    // Build dots
    for (let i = 0; i < TOTAL; i++) {
        const d = document.createElement('div');
        d.className = 'slider-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => go(i));
        dotsWrap.appendChild(d);
    }

    function slideW() {
        const s = track.querySelector('.trending__slide');
        return s ? s.offsetWidth + 28 : 0;
    }

    function go(i) {
        idx = i;
        track.style.transform = `translateX(-${idx * slideW()}px)`;
        dotsWrap.querySelectorAll('.slider-dot').forEach((d, k) =>
            d.classList.toggle('active', k === idx));
    }

    window.slideMove = function (dir) {
        go((idx + dir + TOTAL) % TOTAL);
        clearInterval(timer);
        if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => window.slideMove(1), 4000);
    };

    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => window.slideMove(1), 4000);
    window.addEventListener('resize', () => go(idx));
})();

/* ── Hero entrance ────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    renderOutfits(OUTFITS);
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal').forEach((el, i) =>
            setTimeout(() => el.classList.add('visible'), i * 130));
    }, 150);
});
