# App/utils/sorting.py

class SortingAlgorithms:

    @staticmethod
    def quick_sort(items, key='weighted_rating', reverse=False):
        """Quick Sort implementation"""
        if len(items) <= 1:
            return items

        pivot = items[len(items) // 2]
        pivot_value = getattr(pivot, key)

        left = [item for item in items if getattr(item, key) < pivot_value]
        middle = [item for item in items if getattr(item, key) == pivot_value]
        right = [item for item in items if getattr(item, key) > pivot_value]

        if reverse:
            return SortingAlgorithms.quick_sort(right, key, reverse) + middle + SortingAlgorithms.quick_sort(left, key,
                                                                                                             reverse)
        return SortingAlgorithms.quick_sort(left, key, reverse) + middle + SortingAlgorithms.quick_sort(right, key,
                                                                                                        reverse)

    @staticmethod
    def merge_sort(items, key='weighted_rating', reverse=False):
        """Merge Sort implementation"""
        if len(items) <= 1:
            return items

        mid = len(items) // 2
        left = SortingAlgorithms.merge_sort(items[:mid], key, reverse)
        right = SortingAlgorithms.merge_sort(items[mid:], key, reverse)

        return SortingAlgorithms._merge(left, right, key, reverse)

    @staticmethod
    def _merge(left, right, key, reverse):
        result = []
        i = j = 0

        while i < len(left) and j < len(right):
            left_val = getattr(left[i], key)
            right_val = getattr(right[j], key)

            if reverse:
                condition = left_val >= right_val
            else:
                condition = left_val <= right_val

            if condition:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1

        result.extend(left[i:])
        result.extend(right[j:])
        return result

    @staticmethod
    def heap_sort(items, key='weighted_rating', reverse=False):
        """Heap Sort implementation"""
        import heapq

        if reverse:
            heap = [(-getattr(item, key), item) for item in items]
        else:
            heap = [(getattr(item, key), item) for item in items]

        heapq.heapify(heap)
        return [heapq.heappop(heap)[1] for _ in range(len(heap))]
