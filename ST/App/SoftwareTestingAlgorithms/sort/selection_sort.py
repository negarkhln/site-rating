def manual_selection_sort_by_rating(data_list, reverse=True):
    n = len(data_list)
    arr = list(data_list)

    for i in range(n):
        target_idx = i
        for j in range(i + 1, n):
            rating1 = float(arr[j].weighted_rating) if arr[j].weighted_rating else 0.0
            rating2 = float(arr[target_idx].weighted_rating) if arr[target_idx].weighted_rating else 0.0

            condition = rating1 > rating2 if reverse else rating1 < rating2
            if condition:
                target_idx = j

        arr[i], arr[target_idx] = arr[target_idx], arr[i]
    return arr
