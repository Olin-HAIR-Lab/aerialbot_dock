import json
from math import ceil

def chop_json(path: str, chunk_size: int = 50) -> list[str]:
    try:
        with open(path, "r") as file:
            json_data = json.load(file)
            json_string = json.dumps(json_data)  # Convert to a JSON string
    except Exception as e:
        print(f"Error loading JSON file: {e}")
        exit(1)

    # MAVLink has a max payload size (STATUSTEXT max is 50 chars), so we send in chunks
    chunks = [json_string[i : i + chunk_size] for i in range(0, len(json_string), chunk_size)]

    # Add marker to ensure no chunks go missing
    num_chunks = ceil(len(json_string)/chunk_size)
    chunks = [f"{i+1}/{num_chunks}|" + chunk for i, chunk in enumerate(chunks)]
    return chunks

def rebuild_json(chunks: str)->None:
    data = json.loads(chunks)
    with open("mock_data.json", "w") as file:
        json.dump(data, file, indent=4)


if __name__ == "__main__":
    a = chop_json("fake_data.json")

    for line in a:
        print(line)
       
