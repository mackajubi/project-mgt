from api.config import api


from api.apis.Auth.views import api as ns_auth
from api.apis.Workload.views import api as ns_workload
from api.apis.Dashboard.views import api as ns_dashboard
from api.apis.Department.views import api as ns_department


# Register namespaces.
api.add_namespace(ns_auth, path='/0.0.1/Auth')
api.add_namespace(ns_workload, path='/0.0.1/Workload')
api.add_namespace(ns_dashboard, path='/0.0.1/Dashboard')
api.add_namespace(ns_department, path='/0.0.1/Department')