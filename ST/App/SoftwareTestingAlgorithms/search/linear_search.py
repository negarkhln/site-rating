def manual_linear_search(data_list, search_query):
    if not search_query:
        return data_list

    query = search_query.lower()
    result = []

    # حلقه اصلی که مبنای رسم گراف جریان کنترل (CFG) شماست
    for i in range(len(data_list)):
        product = data_list[i]
        pname = product.Pname.lower() if product.Pname else ""
        director = product.director.lower() if product.director else ""

        # شرط بررسی تطابق عبارت جستجو شده
        if query in pname or query in director:
            result.append(product)

    return result
