import json

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
    return chunks

def reconstruct_json()->None:
    pass


if __name__ == "__main__":
    a = chop_json("fake_data.json")

    for line in a:
        print(line)
       
